import ScalarApiReference from "@scalar/fastify-api-reference";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(ScalarApiReference, {
      routePrefix: "/docs",
      configuration: {
        title: "Sudoking API",
        url: "/openapi.json",
      },
      hooks: {
        // onRequest: (request, reply, done) => {
        //   if (request.headers.docsToken !== "test") {
        //     reply.status(401).send({ message: "Unauthorized" });
        //     return;
        //   }
        //   done();
        // },
        preHandler: (_, reply, done) => {
          reply.header(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.scalar.com/; font-src 'self' https://fonts.scalar.com/;",
          );
          done();
        },
      },
    });
    done();
  },
);
