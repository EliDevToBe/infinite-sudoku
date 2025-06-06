import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import cleanupUrl from "./cleanup-url";
import fp from "fastify-plugin";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(cleanupUrl);
    done();
  }
);
