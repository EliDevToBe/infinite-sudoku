import type { Prisma } from "@prisma/client";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { UserController } from "../controllers/user.controller.js";
import { authenticated } from "../utils/auth.js";

type UserInsert = Prisma.userCreateInput;
type UserUpdate = Prisma.userUpdateInput;

const userResponseSchema = {
  id: { type: "string", format: "uuid" },
  pseudo: { type: "string" },
  email: { type: "string", format: "email" },
  password: { type: "string", format: "password" },
  avatar: { type: "string", format: "url" },
  has_confirmed_email: { type: "boolean" },
  created_at: { type: "string", format: "date-time" },
  updated_at: { type: "string", format: "date-time" },
  role: { type: "string", enum: ["member"] },
  quality: { type: "string", enum: ["basic", "premium"] },
};

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.get(
      "/user",
      {
        schema: {
          description: "Retrieve all users",
          tags: ["User"],
          summary: "GET All users",
          security: [{ apiKey: [] }],
          response: {
            200: {
              description: "Default response",
              type: "array",
              items: {
                type: "object",
                properties: userResponseSchema,
              },
            },
          },
        },
        preHandler: authenticated,
      },
      UserController().getUsers,
    );

    server.get<{ Params: { id: string } }>(
      "/user/:id",
      {
        schema: {
          description: "Get user by id",
          tags: ["User"],
          summary: "Get user by id",
        },
        preHandler: authenticated,
      },
      UserController().getUser,
    );

    server.post<{ Body: UserInsert }>(
      "/user",
      { preHandler: authenticated },
      UserController().createUser,
    );

    server.put<{ Params: { id: string }; Body: UserUpdate }>(
      "/user/:id",
      { preHandler: authenticated },
      UserController().updateUser,
    );

    server.delete<{ Params: { id: string } }>(
      "/user/:id",
      { preHandler: authenticated },
      UserController().deleteUser,
    );

    done();
  },
);
