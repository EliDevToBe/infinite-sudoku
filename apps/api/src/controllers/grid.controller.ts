import type { FastifyReply, FastifyRequest } from "fastify";
import type { Prisma } from "@prisma/client";

type GridInsert = Prisma.gridCreateInput;

export const GridController = () => {
  const getGrids = async (request: FastifyRequest, reply: FastifyReply) => {
    const prisma = request.server.prisma;

    try {
      const grids = await prisma.grid.findMany();

      reply.send(grids);
    } catch (error) {
      reply.status(500).send({ message: "Failed to get users", error });
    }
  };

  const getGrid = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const prisma = request.server.prisma;
    try {
      const gridId = request.params.id;

      console.warn(request.originalUrl);

      const grid = await prisma.grid.findUnique({
        where: { id: gridId },
      });

      if (!grid) {
        reply.status(404).send({ message: "Grid not found" });
        return;
      }

      reply.send(grid);
    } catch (error) {
      reply.status(500).send({
        message: "Failed to get grid",
        error,
        userId: request.params.id,
      });
    }
  };

  const createGrid = async (
    request: FastifyRequest<{ Body: GridInsert }>,
    reply: FastifyReply
  ) => {
    const prisma = request.server.prisma;
    try {
      const grid = await prisma.grid.create({ data: request.body });

      reply.send(grid);
    } catch (error) {
      reply.status(500).send({ message: "Failed to create grid", error });
    }
  };

  const deleteGrid = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const prisma = request.server.prisma;
    const gridId = request.params.id;

    try {
      await prisma.grid.delete({ where: { id: gridId } });
      reply.send({ message: "Grid deleted successfully" });
    } catch (error) {
      reply.status(500).send({ message: "Failed to delete grid", error });
    }
  };

  return { getGrids, getGrid, createGrid, deleteGrid };
};
