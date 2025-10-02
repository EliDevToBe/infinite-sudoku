import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { EmailController } from "../controllers/email.controller.js";
import { ForgotPasswordBody } from "../services/email.interface.js";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.post<{ Body: ForgotPasswordBody }>(
      "/email/forgot-password",
      {
        schema: {
          body: {
            type: "object",
            properties: {
              payload: {
                type: "object",
                properties: {
                  email: { type: "string" },
                },
                required: ["email"],
              },
            },
          },
        },
      },
      EmailController().sendReset,
    );

    done();
  },
);
