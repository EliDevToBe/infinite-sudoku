import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { UserGridController } from "../controllers/user-grid.controller";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.get("/user-grid", UserGridController().getUserGrids);

    server.get("/user-grid/:id", UserGridController().getUserGrid);

    server.post("/user-grid", UserGridController().createUserGrid);

    server.delete("/user-grid/:id", UserGridController().deleteUserGrid);

    done();
  }
);
