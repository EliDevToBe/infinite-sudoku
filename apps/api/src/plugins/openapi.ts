import FastifySwagger from "@fastify/swagger";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(FastifySwagger, {
      openapi: {
        info: {
          title: "Sudoking API",
          version: "1.0.0",
        },

        components: {
          securitySchemes: {
            apiKey: {
              type: "apiKey",
              name: "authorization",
              in: "header",
            },
            basic: {
              type: "http",
              scheme: "basic",
            },
          },
        },
      },
    });

    done();
  },
);
