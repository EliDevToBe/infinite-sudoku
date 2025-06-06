import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { UserController } from "../controllers/user.controller";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.get("/user", UserController().getUsers);

    server.get("/user/:id", UserController().getUser);

    server.post("/user", UserController().createUser);

    server.put("/user/:id", UserController().updateUser);

    server.delete("/user/:id", UserController().deleteUser);

    done();
  },
);
