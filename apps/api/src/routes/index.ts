import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import authRoutes from "./auth/auth.routes";
import gridRoutes from "./grid.routes";
import userGridRoutes from "./user-grid.routes";
import userRoutes from "./user.routes";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(authRoutes);
    server.register(userRoutes);
    server.register(gridRoutes);
    server.register(userGridRoutes);

    done();
  },
);
