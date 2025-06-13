import type { Prisma } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { useHash } from "../utils/hash";
import { useToken } from "../utils/token";

type RegisterInput = Prisma.userCreateInput;

const { hashPassword } = useHash();
const { generateToken } = useToken();

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

      const token = generateToken(tokenizedUser);

      const authUser = {
        id: user.id,
        email: user.email,
        quality: user.quality,
        role: user.role,
      };

      return reply.status(201).send({
        user: authUser,
        token,
      });
    } catch (error) {
      reply.status(500).send({ message: "Internal server error", error });
    }
  };

  return { register };
};
