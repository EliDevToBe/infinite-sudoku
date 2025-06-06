import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import cors from "./cors";
import helmet from "./helmet";
import prisma from "./prisma";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(cors);
    server.register(helmet);
    server.register(prisma);
    done();
  },
);
