import cors from "@fastify/cors";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { isProduction } from "../utils/isProduction.js";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    if (!process.env.FRONTEND_URL) {
      throw new Error("FRONTEND_URL is not defined");
    }

    server.register(cors, {
      origin: [isProduction() ? process.env.FRONTEND_URL : "*"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Origin",
        "Accept",
        "access-token",
      ],
      exposedHeaders: ["access-token"],
      credentials: true,
    });

    done();
  },
);
