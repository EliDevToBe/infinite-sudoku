import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import authRoutes from "./auth/auth.routes.js";
import gridRoutes from "./grid.routes.js";
import leaderboardRoutes from "./leaderboard.routes.js";
import userRoutes from "./user.routes.js";
import userGridRoutes from "./user-grid.routes.js";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(authRoutes);
    server.register(userRoutes);
    server.register(gridRoutes);
    server.register(userGridRoutes);
    server.register(leaderboardRoutes);
    done();
  },
);
