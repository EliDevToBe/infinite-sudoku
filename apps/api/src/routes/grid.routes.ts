import type { Prisma } from "@prisma/client";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { GridController } from "../controllers/grid.controller";
import { authenticated } from "../utils/auth";

type GridInsert = Prisma.gridCreateInput;

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.get(
      "/grid",
      { preHandler: authenticated },
      GridController().getGrids,
    );

    server.get<{ Params: { id: string } }>(
      "/grid/:id",
      { preHandler: authenticated },
      GridController().getGrid,
    );

    server.post<{ Body: GridInsert }>(
      "/grid",
      { preHandler: authenticated },
      GridController().createGrid,
    );

    server.delete<{ Params: { id: string } }>(
      "/grid/:id",
      { preHandler: authenticated },
      GridController().deleteGrid,
    );

    done();
  },
);
