import type { Prisma } from "@prisma/client";
import type { DifficultyOptions } from "@shared/utils/sudoku/helper.js";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { GridController } from "../controllers/grid.controller.js";
import { authenticated } from "../middlewares/auth.middleware.js";

type GridInsert = Prisma.gridCreateInput;

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.get("/grid", GridController().getGrids);

    server.get<{ Params: { id: string } }>(
      "/grid/:id",
      GridController().getGrid,
    );

    server.get<{ Params: { difficulty: DifficultyOptions } }>(
      "/grid/difficulty/:difficulty",
      GridController().getRandomGridByDifficulty,
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
