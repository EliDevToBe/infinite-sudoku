import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { UserGridController } from "../controllers/user-grid.controller";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.get("/user-grid", UserGridController().getAllUserGrids);

    server.get("/user-grid/user/:id", UserGridController().getByUserId);

    server.get("/user-grid/grid/:id", UserGridController().getByGridId);

    server.get("/user-grid/:id", UserGridController().getById);

    server.post("/user-grid", UserGridController().createUserGrid);

    server.delete("/user-grid/:id", UserGridController().deleteUserGrid);

    done();
  },
);
