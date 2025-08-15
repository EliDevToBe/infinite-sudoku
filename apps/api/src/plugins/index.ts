import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import cors from "./cors.js";
import helmet from "./helmet.js";
import openapi from "./openapi.js";
import prisma from "./prisma.js";
import swaggerUi from "./swagger-ui.js";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(openapi);
    server.register(swaggerUi);
    server.register(cors);
    server.register(helmet);
    server.register(prisma);
    done();
  },
);
