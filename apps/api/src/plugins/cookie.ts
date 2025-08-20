import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    if (!process.env.COOKIE_SECRET) {
      server.log.error("COOKIE_SECRET is not defined");
      throw new Error("COOKIE_SECRET is not defined");
    }

    server.register(cookie, {
      secret: process.env.COOKIE_SECRET,
      hook: "onRequest",
    }) as FastifyCookieOptions;

    done();
  },
);
