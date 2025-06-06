import type { FastifyReply, FastifyRequest } from "fastify";
import type { Prisma } from "@prisma/client";

type UserInsert = Prisma.userCreateInput;
type UserUpdate = Prisma.userUpdateInput;

export const UserController = () => {
  const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    const prisma = request.server.prisma;

    try {
      const users = await prisma.user.findMany();

      reply.send(users);
    } catch (error) {
      reply.status(500).send({ message: "Failed to get users", error });
    }
  };

  const getUser = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const prisma = request.server.prisma;
    try {
      const userId = request.params.id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        reply.status(404).send({ message: "User not found" });
        return;
      }

      reply.send(user);
    } catch (error) {
      reply.status(500).send({
        message: "Failed to get user",
        error,
        userId: request.params.id,
      });
    }
  };

  const createUser = async (
    request: FastifyRequest<{ Body: UserInsert }>,
    reply: FastifyReply
  ) => {
    const prisma = request.server.prisma;
    try {
      const user = await prisma.user.create({ data: request.body });

      reply.send(user);
    } catch (error) {
      reply.status(500).send({ message: "Failed to create user", error });
    }
  };

  const updateUser = async (
    request: FastifyRequest<{ Params: { id: string }; Body: UserUpdate }>,
    reply: FastifyReply
  ) => {
    const prisma = request.server.prisma;
    const userId = request.params.id;
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: request.body,
      });

      reply.send(user);
    } catch (error) {
      reply.status(500).send({ message: "Failed to update user", error });
    }
  };

  const deleteUser = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const prisma = request.server.prisma;
    const userId = request.params.id;
    try {
      await prisma.user.delete({ where: { id: userId } });
      reply.send({ message: "User deleted successfully" });
    } catch (error) {
      reply.status(500).send({ message: "Failed to delete user", error });
    }
  };

  return { getUsers, getUser, createUser, updateUser, deleteUser };
};
