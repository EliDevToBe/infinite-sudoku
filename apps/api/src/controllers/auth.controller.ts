import type { Prisma } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { useHash } from "../utils/hash";
import { useToken } from "../utils/token";

type RegisterInput = Prisma.userCreateInput;
type LoginInput = {
  email: string;
  password: string;
};

const { hashPassword, verifyPassword } = useHash();
const { generateAccessToken, generateRefreshToken } = useToken();

export const AuthController = () => {
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
        return reply.status(403).send({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: { email, password: hashedPassword, pseudo },
      });

      const tokenizedUser = {
        id: user.id,
        email: user.email,
      };

      const accessToken = generateAccessToken(tokenizedUser);
      const refreshToken = generateRefreshToken(tokenizedUser);

      const authUser = {
        id: user.id,
        email: user.email,
        quality: user.quality,
        role: user.role,
      };

      reply.headers({
        "access-token": accessToken,
        "refresh-token": refreshToken,
      });

      return reply.status(201).send({
        user: authUser,
      });
    } catch (error) {
      reply.status(500).send({ message: "Internal server error", error });
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
        return reply.status(401).send({ message: "Invalid credentials" });
      }

      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({ message: "Invalid credentials" });
      }

      const tokenizedUser = {
        id: user.id,
        email: user.email,
      };

      const accessToken = generateAccessToken(tokenizedUser);
      const refreshToken = generateRefreshToken(tokenizedUser);

      const authUser = {
        id: user.id,
        email: user.email,
        quality: user.quality,
        role: user.role,
      };

      reply.headers({
        "access-token": accessToken,
        "refresh-token": refreshToken,
      });

      return reply.status(200).send({
        user: authUser,
      });
    } catch (error) {
      reply.status(500).send({ message: "Internal server error", error });
    }
  };
  return { register, login };
};
