import type { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
  interface FastifyRequest {
    user: {
      id: string | null;
    };
    _user?: {
      id: string | null;
    };
  }
}

declare module "jsonwebtoken";
