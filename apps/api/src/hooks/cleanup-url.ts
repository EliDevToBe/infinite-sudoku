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
        if (
          !request.headers["access-token"] ||
          !request.headers["refresh-token"]
        ) {
          request.headers = {
            ...request.headers,
            "access-token": "",
            "refresh-token": "",
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

        // Handling missing ids
        if (request.url.endsWith("/user-grid/grid")) {
          reply.code(301).redirect(request.url.replace(/\/grid$/, ""));
          return;
        }
        if (request.url.endsWith("/user-grid/user")) {
          reply.code(301).redirect(request.url.replace(/\/user$/, ""));
          return;
        }

        done();
      },
    );
    done();
  },
);
