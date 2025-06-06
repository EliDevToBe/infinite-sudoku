import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.addHook(
      "onRequest",
      (request: FastifyRequest, reply: FastifyReply, done) => {
        if (request.url.length > 1 && request.url.endsWith("/")) {
          reply.code(301).redirect(request.url.replace(/\/+$/, ""));
          return;
        }
        done();
      },
    );
    done();
  },
);
