import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import prisma from "./prisma";
import cors from "./cors";
import helmet from "./helmet";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(cors);
    server.register(helmet);
    server.register(prisma);
    done();
  }
);
