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

      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: { email, password: hashedPassword, pseudo },
      });

      const tokenizedUser = {
        id: user.id,
        email: user.email,
      };

      const token = generateToken(tokenizedUser);

      return reply.status(201).send({ user, token });
    } catch (error) {
      reply.status(500).send({ message: "Internal server error", error });
    }
  };

  return { register };
};
