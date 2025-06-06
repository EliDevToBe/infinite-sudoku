import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import userRoutes from "./user.routes";
import gridRoutes from "./grid.routes";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(userRoutes);
    server.register(gridRoutes);

    done();
  }
);
