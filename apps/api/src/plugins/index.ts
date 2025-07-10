import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import cors from "./cors";
import helmet from "./helmet";
import openapi from "./openapi";
import prisma from "./prisma";
import scalar from "./scalar";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(openapi);
    server.register(scalar);
    server.register(cors);
    server.register(helmet);
    server.register(prisma);
    done();
  },
);
