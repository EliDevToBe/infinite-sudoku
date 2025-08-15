import { PrismaClient } from "@prisma/client";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log:
        process.env.NODE_ENV === "develop"
          ? ["query", "error", "warn"]
          : ["error", "warn"],
    });

    server.decorate("prisma", prisma);

    server.prisma
      .$connect()
      .then(() => {
        server.log.info("🔌 Prisma connected to database 🔌");
      })
      .catch((error) => {
        server.log.error("❌ Prisma connection failed:", error);
      });

    server.addHook("onClose", async () => {
      await prisma.$disconnect();
      server.log.info("🔌 Prisma disconnected 🔌");
    });

    done();
  },
);
