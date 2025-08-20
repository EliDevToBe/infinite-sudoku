import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { AuthController } from "../../controllers/auth.controller.js";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.post(
      "/auth/login",
      {
        schema: {
          description: "Login into API",
          tags: ["Login"],
          summary: "Login into API",
          body: {
            type: "object",
            properties: {
              email: { type: "string" },
              password: { type: "string" },
            },
            required: ["email", "password"],
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
