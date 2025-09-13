import type { Prisma } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { getDifficultyFromMissingCells } from "../../../../packages/shared/utils/sudoku/helper.js";

export type UserGridInsert = Prisma.user_gridCreateInput & {
  user_id: string;
  grid_id: string;
};
export type UserGridUpdate = Prisma.user_gridUpdateInput;

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
      reply
        .status(500)
        .send({ clientMessage: "Failed to get user grids", error });
    }
  };

  const getById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    const gridId = request.params.id;

    try {
      const grid = await prisma.user_grid.findUnique({
        where: { id: gridId },
      });

      if (!grid) {
        reply.status(404).send({ clientMessage: "User grid not found" });
        return;
      }

      reply.send(grid);
    } catch (error) {
      reply.status(500).send({
        clientMessage: "Failed to get user grid",
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
        reply.status(400).send({ clientMessage: "User ID is required" });
        return;
      }

      const userGrids = await prisma.user_grid.findMany({
        where: { user_id: userId, finished_at: null },
        select: {
          backup_wip: true,
          grid: {
            select: {
              id: true,
              difficulty: true,
            },
          },
        },
      });

      const result = userGrids.map((userGrid) => ({
        id: userGrid.grid.id,
        difficulty: getDifficultyFromMissingCells(userGrid.grid.difficulty),
        hardSave: userGrid.backup_wip,
      }));

      reply.send(result);
    } catch (error) {
      reply.status(500).send({
        clientMessage: "Failed to get user grid",
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
        clientMessage: "Failed to get user grid",
        error,
        gridId: request.params.id,
      });
    }
  };

  /**
   * Create a user grid
   * If the user grid already exists, update it
   * If the user grid does not exist, create it
   */
  const createUserGrid = async (
    request: FastifyRequest<{ Body: UserGridInsert }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    try {
      const { user_id, grid_id, ...data } = request.body;
      const existingUserGrid = await prisma.user_grid.findUnique({
        where: {
          user_id_grid_id: {
            user_id: user_id,
            grid_id: grid_id,
          },
        },
        select: {
          id: true,
        },
      });

      if (existingUserGrid) {
        await prisma.user_grid.update({
          where: { id: existingUserGrid.id },
          data: data,
        });
        return reply.status(200).send(existingUserGrid);
      }

      const userGridId = await prisma.user_grid.create({
        data: {
          ...data,
          grid: { connect: { id: grid_id } },
          user: { connect: { id: user_id } },
        },
        select: {
          id: true,
        },
      });

      return reply.status(201).send(userGridId);
    } catch (error) {
      return reply
        .status(500)
        .send({ clientMessage: "Failed to create grid", error });
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
      reply.send({ clientMessage: "User grid updated successfully" });
    } catch (error) {
      reply
        .status(500)
        .send({ clientMessage: "Failed to update user grid", error });
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
      reply.send({ clientMessage: "User grid deleted successfully" });
    } catch (error) {
      reply
        .status(500)
        .send({ clientMessage: "Failed to delete user grid", error });
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
