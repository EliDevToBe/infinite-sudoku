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
            200: {
              type: "object",
              properties: {
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    email: { type: "string" },
                    pseudo: { type: "string" },
                    quality: { type: "string" },
                    role: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      AuthController().login,
    );

    server.post("/auth/logout", AuthController().logout);

    server.post("/auth/register", AuthController().register);

    server.get("/auth/refresh", AuthController().refresh);

    server.post("/auth/reset-password", AuthController().resetPassword);

    server.post("/auth/confirm-email", AuthController().confirmEmail);

    done();
  },
);
