import type { Prisma } from "@prisma/client";
import { isProduction } from "@shared/utils/index.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { useHash } from "../utils/hash.js";
import { useToken } from "../utils/token.js";

type RegisterInput = Prisma.userCreateInput;
type User = Prisma.userGetPayload<{
  select: {
    id: true;
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
  path: "/auth",
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

    const accessToken = generateToken(tokenizedUser, { type: "access" });
    const refreshToken = generateToken(tokenizedUser, { type: "refresh" });

    const authUser = {
      id: user.id,
      email: user.email,
      quality: user.quality,
      role: user.role,
    };

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
        return reply.status(401).send({ clientMessage: "Invalid credentials" });
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
      return reply.status(401).send({ clientMessage: "Unauthorized" });
    }
    try {
      const decoded = verifyToken({ token: refreshToken, type: "refresh" });
      const hasRefreshExpired = isJwtExpired(decoded);

      if (hasRefreshExpired) {
        return reply.status(401).send({ clientMessage: "Unauthorized" });
      }

      const accessToken = generateToken(decoded, { type: "access" });

      reply.headers({
        "access-token": accessToken,
      });

      return reply.status(200);
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
