import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import cleanupUrl from "./cleanup-url";
import treePlugins from "./tree-plugins.hook";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(treePlugins);
    server.register(cleanupUrl);
    done();
  },
);
