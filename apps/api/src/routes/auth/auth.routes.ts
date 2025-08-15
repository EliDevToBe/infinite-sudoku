import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { AuthController } from "../../controllers/auth.controller";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.post(
      "/auth/login",
      {
        schema: {
          description: "Login into API",
          tags: ["Login"],
          summary: "Login into API",
          security: [{ basic: [] }],
          consumes: ["application/json"],
          produces: ["application/json"],
          body: {
            type: "object",
            properties: {
              email: { type: "string" },
            },
          },
          response: {
            200: {},
          },
        },
      },
      AuthController().login,
    );
    server.post("/auth/register", AuthController().register);
    done();
  },
);
