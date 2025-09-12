import type { Prisma } from "@prisma/client";
import type { DifficultyOptions } from "@shared/utils/sudoku/helper.js";
import { getRangeFromDifficulty } from "@shared/utils/sudoku/helper.js";
import type { FastifyReply, FastifyRequest } from "fastify";

type GridInsert = Prisma.gridCreateInput;

export const GridController = () => {
  const getGrids = async (request: FastifyRequest, reply: FastifyReply) => {
    const prisma = request.server.prisma;

    try {
      const grids = await prisma.grid.findMany();

      reply.send(grids);
    } catch (error) {
      reply.status(500).send({ clientMessage: "Failed to get users", error });
    }
  };

  const getGrid = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    try {
      const gridId = request.params.id;

      const grid = await prisma.grid.findUnique({
        where: { id: gridId },
      });

      if (!grid) {
        reply.status(404).send({ clientMessage: "Grid not found" });
        return;
      }

      reply.send(grid);
    } catch (error) {
      reply.status(500).send({
        clientMessage: "Failed to get grid",
        error,
        userId: request.params.id,
      });
    }
  };

  const getRandomGridByDifficulty = async (
    request: FastifyRequest<{ Params: { difficulty: DifficultyOptions } }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    const difficulty = request.params.difficulty;

    const range = getRangeFromDifficulty(difficulty);

    try {
      const grids = await prisma.grid.findMany({
        where: { difficulty: { in: range } },
      });

      const grid = grids[Math.floor(Math.random() * grids.length)];

      reply.send(grid);
    } catch (error) {
      reply
        .status(500)
        .send({ clientMessage: "Failed to get random grid", error });
    }
  };

  const createGrid = async (
    request: FastifyRequest<{ Body: GridInsert }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    try {
      const grid = await prisma.grid.create({ data: request.body });

      reply.send(grid);
    } catch (error) {
      reply.status(500).send({ clientMessage: "Failed to create grid", error });
    }
  };

  const deleteGrid = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const prisma = request.server.prisma;
    const gridId = request.params.id;

    try {
      await prisma.grid.delete({ where: { id: gridId } });
      reply.send({ clientMessage: "Grid deleted successfully" });
    } catch (error) {
      reply.status(500).send({ clientMessage: "Failed to delete grid", error });
    }
  };

  return {
    getGrids,
    getGrid,
    createGrid,
    deleteGrid,
    getRandomGridByDifficulty,
  };
};
