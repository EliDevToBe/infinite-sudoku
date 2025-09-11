import { PrismaClient } from "@prisma/client";
import { task } from "@trigger.dev/sdk";

// Initialize Prisma client

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export const addNewUser = task({
  id: "prisma-integration-test",
  run: async () => {
    const user = await prisma.user.create({
      data: {
        email: "prisma-from-trigger3@test.com",
        password: "prisma-from-trigger",
        pseudo: "no-dot-env",
      },
    });

    return {
      message: `New user added successfully: ${user.id}`,
    };
  },
});
