import FastifySwaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(FastifySwaggerUi, {
      routePrefix: "/",
      uiConfig: {
        docExpansion: "list",
        //   deepLinking: true,
        //   displayOperationId: false,
        displayRequestDuration: true,
        filter: true,
        // showExtensions: true,
        // showCommonExtensions: true,
        // tryItOutEnabled: true,
      },
      // staticCSP: true,
      transformSpecification: (swaggerObject) => swaggerObject,
      transformStaticCSP: (header) => header,
    });

    server.log.info("💅 Swagger UI Ready 💅");

    done();
  },
);
