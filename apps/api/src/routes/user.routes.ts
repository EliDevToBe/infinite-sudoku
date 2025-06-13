import type { Prisma } from "@prisma/client";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { UserController } from "../controllers/user.controller";
import { authenticated } from "../utils/auth";

type UserInsert = Prisma.userCreateInput;
type UserUpdate = Prisma.userUpdateInput;

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.get(
      "/user",
      { preHandler: authenticated },
      UserController().getUsers,
    );

    server.get<{ Params: { id: string } }>(
      "/user/:id",
      { preHandler: authenticated },
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
