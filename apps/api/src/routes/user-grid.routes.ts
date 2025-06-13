import type { Prisma } from "@prisma/client";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { UserGridController } from "../controllers/user-grid.controller";
import { authenticated } from "../utils/auth";

type UserGridInsert = Prisma.user_gridCreateInput;
type UserGridUpdate = Prisma.user_gridUpdateInput;

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.get(
      "/user-grid",
      { preHandler: authenticated },
      UserGridController().getAllUserGrids,
    );

    server.get<{ Params: { id: string } }>(
      "/user-grid/user/:id",
      { preHandler: authenticated },
      UserGridController().getByUserId,
    );

    server.get<{ Params: { id: string } }>(
      "/user-grid/grid/:id",
      { preHandler: authenticated },
      UserGridController().getByGridId,
    );

    server.get<{ Params: { id: string } }>(
      "/user-grid/:id",
      { preHandler: authenticated },
      UserGridController().getById,
    );

    server.post<{ Body: UserGridInsert }>(
      "/user-grid",
      { preHandler: authenticated },
      UserGridController().createUserGrid,
    );

    server.put<{ Params: { id: string }; Body: UserGridUpdate }>(
      "/user-grid/:id",
      { preHandler: authenticated },
      UserGridController().updateUserGrid,
    );

    server.delete<{ Params: { id: string } }>(
      "/user-grid/:id",
      { preHandler: authenticated },
      UserGridController().deleteUserGrid,
    );

    done();
  },
);
