import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import userRoutes from "./user.routes";
import gridRoutes from "./grid.routes";
import userGridRoutes from "./user-grid.routes";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(userRoutes);
    server.register(gridRoutes);
    server.register(userGridRoutes);

    done();
  }
);
