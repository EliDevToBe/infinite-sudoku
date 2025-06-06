import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { GridController } from "../controllers/grid.controller";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.get("/grid", GridController().getGrids);

    server.get("/grid/:id", GridController().getGrid);

    server.post("/grid", GridController().createGrid);

    server.delete("/grid/:id", GridController().deleteGrid);

    done();
  },
);
