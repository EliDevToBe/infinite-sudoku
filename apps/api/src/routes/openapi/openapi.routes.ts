import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

// Serve an OpenAPI file
export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.get("/openapi.json", async (_request, _reply) => {
      return server.swagger();
    });
    done();
  },
);
