import type { Prisma } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { useHash } from "../utils/hash.js";
import { isProduction } from "../utils/isProduction.js";
import { useToken } from "../utils/token.js";

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

const { hashPassword, verifyPassword } = useHash();
const { generateToken, verifyToken, isJwtExpired } = useToken();

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction(),
  maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
  sameSite: "strict" as const,
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
      return reply.status(500).send({ clientMessage: "Internal server error" });
    }
  };

  const logout = async (_: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie("refresh-token", REFRESH_TOKEN_COOKIE_OPTIONS);

    reply.headers({
      "access-token": "",
      "refresh-token": "",
    });

    return reply.status(200).send({ clientMessage: "Logged out" });
  };

  return { register, login, refresh, logout };
};
