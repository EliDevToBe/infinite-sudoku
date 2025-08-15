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
              name: "access-token",
              in: "header",
              description: "text",
            },
            basic: {
              type: "http",
              scheme: "basic",
              description:
                "Needed to log for the first time into the API as a query tool",
            },
            okay: {
              type: "http",
              scheme: "basic",
              description:
                "Needed to log for the first time into the API as a query tool",
            },
            refreshToken: {
              type: "apiKey",
              name: "refresh-token",
              in: "header",
            },
            accessToken: {
              type: "apiKey",
              name: "access-token",
              in: "header",
            },
          },
        },
      },
    });

    done();
  },
);
