import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { LeaderboardController } from "../controllers/leaderboard.controller.js";
import { authenticated } from "../middlewares/auth.middleware.js";

export default fp(
  async (server: FastifyInstance, _opts: FastifyPluginOptions) => {
    server.get<{
      Params: { period: "daily" | "weekly" | "monthly" };
    }>(
      "/leaderboard/:period",
      { preHandler: authenticated },
      LeaderboardController().getLeaderboard,
    );
  },
);
