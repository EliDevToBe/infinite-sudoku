import { PrismaClient } from "@prisma/client";
import { schedules } from "@trigger.dev/sdk/v3";

export const emailConfirmReminderCron = schedules.task({
  id: "email-confirm-reminder-cron",
  run: async () => {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    const users = await prisma.user.findMany({
      where: {
        has_confirmed_email: false,
      },
    });

    const promises = users.map((user) => {
      return fetch(`${process.env.API_URL}/email/confirm-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });
    });

    const results = await Promise.all(promises);

    return {
      user_to_be_emailed: users.length,
      user_ids: users.map((user) => user.id),
      user_emailed: results.filter((result) => result.ok).length,
      failed_to_email: results.filter((result) => !result.ok).length,
    };
  },
});
