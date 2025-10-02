import type { Prisma } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { EmailService } from "../services/email.service.js";
import { notificationUseCase } from "../use-cases/notification.use-case.js";
import { userTokenUseCase } from "../use-cases/user-token.use-case.js";
import { useHash } from "../utils/hash.js";
import { isProduction } from "../utils/isProduction.js";
import { useToken } from "../utils/token.js";

const { TokenExpiredError, JsonWebTokenError } = jwt;

type RegisterInput = Prisma.userCreateInput;
type User = Prisma.userGetPayload<{
  select: {
    id: true;
    pseudo: true;
    email: true;
    quality: true;
    role: true;
  };
}>;
type LoginInput = {
  email: string;
  password: string;
};
export type ResetPasswordInput = {
  password: string;
  token: string;
};

const { hashPassword, verifyPassword } = useHash();
const { generateToken, verifyToken, isJwtExpired } = useToken();

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction(),
  maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
  sameSite: "lax" as const,
  path: "/",
};

export const AuthController = () => {
  /**
   *  Helper function to augment reply object with headers and cookies
   * @param user - The user object to augment
   * @param reply - The reply object to augment
   * @returns The authenticated user object
   * */
  const prepareAuthResponse = (user: User, reply: FastifyReply) => {
    const tokenizedUser = {
      id: user.id,
      email: user.email,
    };

    const authUser = {
      ...tokenizedUser,
      pseudo: user.pseudo,
      quality: user.quality,
      role: user.role,
    };

    const accessToken = generateToken(tokenizedUser, { type: "access" });
    const refreshToken = generateToken(authUser, { type: "refresh" });

    reply.headers({
      "access-token": accessToken,
    });

    reply.setCookie(
      "refresh-token",
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    return authUser;
  };

  const register = async (
    request: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply,
  ) => {
    try {
      const { email, password, pseudo } = request.body;
      const prisma = request.server.prisma;
      const { recordNotification } = notificationUseCase();
      const { recordUserToken } = userTokenUseCase();

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return reply.status(403).send({ clientMessage: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: { email, password: hashedPassword, pseudo },
      });

      const emailClient = new EmailService({ canSend: isProduction() });

      const token = generateToken(
        { id: user.id, email: user.email },
        { type: "email_verification" },
      );

      const emailPayload = {
        userEmail: user.email,
        userPseudo: user.pseudo,
        token,
      };

      const result = await emailClient.sendEmailVerification(emailPayload);

      if (!result.success) {
        const isPreProductionTest = result.messageIds.includes("xxx");
        const message = isPreProductionTest
          ? "[DEV] Emails are disabled in pre-production environment"
          : "Failed to send email";

        return reply.status(500).send({ clientMessage: message });
      }

      await recordNotification(
        { userId: user.id, type: "email_verification", transport: "email" },
        prisma,
      );

      await recordUserToken(
        { userId: user.id, type: "email_verification", token: token },
        prisma,
      );

      const authUser = prepareAuthResponse(user, reply);

      return reply.status(201).send({
        user: authUser,
      });
    } catch (error) {
      reply.status(500).send({ clientMessage: "Internal server error", error });
    }
  };

  const login = async (
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply,
  ) => {
    try {
      const { email, password } = request.body;
      const prisma = request.server.prisma;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(404).send({ clientMessage: "User not found" });
      }

      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({ clientMessage: "Invalid credentials" });
      }

      const authUser = prepareAuthResponse(user, reply);

      return reply.status(200).send({
        user: authUser,
      });
    } catch (error) {
      reply.status(500).send({
        clientMessage: "Internal server error",
        error,
      });
    }
  };

  const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = request.cookies["refresh-token"];

    if (!refreshToken) {
      request.server.log.warn("[refresh] No refresh token found");
      return reply.status(200).send(null);
    }

    try {
      const decoded = verifyToken({ token: refreshToken, type: "refresh" });

      const hasRefreshExpired = isJwtExpired(decoded);

      if (hasRefreshExpired) {
        request.server.log.warn("[refresh] Refresh token expired");
        return reply.status(200).send(null);
      }

      const accessToken = generateToken(
        { id: decoded.id, email: decoded.email },
        { type: "access" },
      );

      const authUser = {
        id: decoded.id,
        email: decoded.email,
        pseudo: decoded.pseudo,
        quality: decoded.quality,
        role: decoded.role,
      };

      reply.headers({
        "access-token": accessToken,
      });

      return reply.status(200).send({
        user: authUser,
      });
    } catch (error) {
      console.error("Error refreshing token", error);

      if (error instanceof TokenExpiredError) {
        return reply.status(401).send({ clientMessage: "Session expired" });
      }
      if (error instanceof JsonWebTokenError) {
        return reply.status(401).send({ clientMessage: "Unauthorized" });
      }
    }
  };

  const logout = async (_: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie("refresh-token", REFRESH_TOKEN_COOKIE_OPTIONS);

    reply.headers({
      "access-token": "",
    });

    return reply.status(200).send({ clientMessage: "Logged out" });
  };

  /**
   * Reset the password of a user.
   *
   * Workflow:
   * - Verify the token
   * - Check if the token is expired
   * - Check if there is a user associated
   * - Check if there is a password reset request associated
   * - Check if the request associated is expired
   *
   * Then:
   * - Update the user's password
   * - Update the request associated to set the `used_at` field to the current date
   * - Return the user's email
   *    - Will be used to auto-login the user
   */
  const resetPassword = async (
    request: FastifyRequest<{ Body: ResetPasswordInput }>,
    reply: FastifyReply,
  ) => {
    const { password, token } = request.body;
    const prisma = request.server.prisma;

    try {
      const decoded = verifyToken({ token, type: "password_reset" });
      const hasExpired = isJwtExpired(decoded);

      if (hasExpired) {
        return reply.status(401).send({ clientMessage: "Invalid token" });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id, email: decoded.email },
      });

      if (!user) {
        return reply.status(403).send({ clientMessage: "Forbidden" });
      }

      const hasRequestedResetPassword = await prisma.user_token.findUnique({
        where: {
          token,
          type: "password_reset",
          user_id: user.id,
          used_at: null,
        },
      });

      if (!hasRequestedResetPassword) {
        return reply
          .status(404)
          .send({ clientMessage: "Password reset request not found" });
      }
      if (hasRequestedResetPassword.expires_at < new Date()) {
        return reply
          .status(401)
          .send({ clientMessage: "Password reset request expired" });
      }

      const hashedPassword = await hashPassword(password);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      await prisma.user_token.update({
        where: { id: hasRequestedResetPassword.id },
        data: { used_at: new Date() },
      });

      return reply.status(200).send({ email: user.email });
    } catch (_error) {
      return reply.status(401).send({ clientMessage: "Unauthorized" });
    }
  };

  const confirmEmail = async (
    request: FastifyRequest<{ Body: { token: string } }>,
    reply: FastifyReply,
  ) => {
    const { token } = request.body;
    const prisma = request.server.prisma;

    try {
      const decoded = verifyToken({ token, type: "email_verification" });
      const hasExpired = isJwtExpired(decoded);

      if (hasExpired) {
        return reply.status(401).send({ clientMessage: "Invalid token" });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id, email: decoded.email },
      });

      if (!user) {
        return reply.status(403).send({ clientMessage: "Forbidden" });
      }

      const emailVerificationRecord = await prisma.user_token.findUnique({
        where: {
          token,
          type: "email_verification",
          user_id: user.id,
          used_at: null,
        },
      });

      if (!emailVerificationRecord) {
        return reply
          .status(404)
          .send({ clientMessage: "Email verification not found" });
      }
      if (emailVerificationRecord.expires_at < new Date()) {
        return reply
          .status(401)
          .send({ clientMessage: "Email verification request expired" });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { has_confirmed_email: true },
      });
      await prisma.user_token.update({
        where: { id: emailVerificationRecord.id },
        data: { used_at: new Date() },
      });

      return reply.status(200).send({ success: true });
    } catch (_error) {
      return reply.status(401).send({ clientMessage: "Unauthorized" });
    }
  };

  return { register, login, refresh, logout, resetPassword, confirmEmail };
};
