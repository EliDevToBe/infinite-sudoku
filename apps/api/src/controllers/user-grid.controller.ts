import type { Prisma } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

type UserGridInsert = Prisma.user_gridCreateInput;
type UserGridUpdate = Prisma.user_gridUpdateInput;

export const UserGridController = () => {
  const getAllUserGrids = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;

    try {
      const userGrids = await prisma.user_grid.findMany();

      reply.send(userGrids);
    } catch (error) {
      reply.status(500).send({ message: "Failed to get user grids", error });
    }
  };

  const getById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    const userGridId = request.params.id;

    try {
      const userGrid = await prisma.user_grid.findUnique({
        where: { id: userGridId },
      });

      if (!userGrid) {
        reply.status(404).send({ message: "User grid not found" });
        return;
      }

      reply.send(userGrid);
    } catch (error) {
      reply.status(500).send({
        message: "Failed to get user grid",
        error,
        userId: request.params.id,
      });
    }
  };

  const getByUserId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    try {
      const userId = request.params.id;

      if (!userId || userId === "") {
        reply.status(400).send({ message: "User ID is required" });
        return;
      }

      const userGrid = await prisma.user_grid.findMany({
        where: { user_id: userId },
      });

      if (!userGrid) {
        reply.status(404).send({ message: "User grid not found" });
        return;
      }

      reply.send(userGrid);
    } catch (error) {
      reply.status(500).send({
        message: "Failed to get user grid",
        error,
        userId: request.params.id,
      });
    }
  };

  const getByGridId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    const gridId = request.params.id;

    try {
      const userGrid = await prisma.user_grid.findMany({
        where: { grid_id: gridId },
      });

      reply.send(userGrid);
    } catch (error) {
      reply.status(500).send({
        message: "Failed to get user grid",
        error,
        gridId: request.params.id,
      });
    }
  };

  const createUserGrid = async (
    request: FastifyRequest<{ Body: UserGridInsert }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    try {
      const userGrid = await prisma.user_grid.create({ data: request.body });

      reply.send(userGrid);
    } catch (error) {
      reply.status(500).send({ message: "Failed to create grid", error });
    }
  };

  const updateUserGrid = async (
    request: FastifyRequest<{ Params: { id: string }; Body: UserGridUpdate }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    const userGridId = request.params.id;
    const body = request.body;

    try {
      await prisma.user_grid.update({
        where: { id: userGridId },
        data: body,
      });
      reply.send({ message: "User grid updated successfully" });
    } catch (error) {
      reply.status(500).send({ message: "Failed to update user grid", error });
    }
  };

  const deleteUserGrid = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    const userGridId = request.params.id;

    try {
      await prisma.user_grid.delete({ where: { id: userGridId } });
      reply.send({ message: "User grid deleted successfully" });
    } catch (error) {
      reply.status(500).send({ message: "Failed to delete user grid", error });
    }
  };

  return {
    getAllUserGrids,
    getById,
    getByUserId,
    getByGridId,
    createUserGrid,
    updateUserGrid,
    deleteUserGrid,
  };
};
