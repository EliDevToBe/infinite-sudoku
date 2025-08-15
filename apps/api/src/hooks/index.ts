import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import cleanupUrl from "./cleanup-url.js";
import treePlugins from "./tree-plugins.hook.js";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(treePlugins);
    server.register(cleanupUrl);
    done();
  },
);
