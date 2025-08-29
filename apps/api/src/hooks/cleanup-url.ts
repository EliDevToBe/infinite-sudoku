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
        if (!request.headers["access-token"]) {
          request.headers = {
            ...request.headers,
            "access-token": "",
          };
        }

        if (
          request.url.length > 1 &&
          request.url.endsWith("/") &&
          !request.url.endsWith("docs/")
        ) {
          reply.code(301).redirect(request.url.replace(/\/+$/, ""));
          return;
        }

        done();
      },
    );
    done();
  },
);
