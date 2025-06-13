import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { AuthController } from "../../controllers/auth.controller";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    // server.post("/auth/login", AuthController().login);
    server.post("/auth/register", AuthController().register);
    done();
  },
);
