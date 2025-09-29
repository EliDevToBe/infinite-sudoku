import {
  NotificationTransport,
  NotificationType,
  PrismaClient,
} from "@prisma/client";

type Payload = {
  userId: string;
  type: NotificationType;
  transport: NotificationTransport;
};

export const notificationUseCase = () => {
  const recordNotification = async (payload: Payload, client: PrismaClient) => {
    try {
      const notification = await client.notification.create({
        data: {
          user_id: payload.userId,
          type: payload.type,
          transport: payload.transport,
        },
      });

      return notification;
    } catch (error) {
      throw new Error("Failed to create notification", {
        cause: { error, payload },
      });
    }
  };

  return { recordNotification };
};
