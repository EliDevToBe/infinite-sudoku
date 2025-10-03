import { FastifyReply, FastifyRequest } from "fastify";
import { ForgotPasswordBody } from "../services/email.interface.js";
import { EmailService } from "../services/email.service.js";
import { notificationUseCase, userTokenUseCase } from "../use-cases/index.js";
import { isProduction } from "../utils/isProduction.js";
import { useToken } from "../utils/token.js";

export const EmailController = () => {
  const sendReset = async (
    request: FastifyRequest<{ Body: ForgotPasswordBody }>,
    reply: FastifyReply,
  ) => {
    const { email } = request.body;
    const prisma = request.server.prisma;
    const { generateToken } = useToken();
    const emailClient = new EmailService({ canSend: isProduction() });

    const { recordNotification } = notificationUseCase();
    const { recordUserToken } = userTokenUseCase();

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(404).send({ clientMessage: "User not found" });
      }

      const token = generateToken(
        { id: user.id, email: user.email },
        { type: "password_reset" },
      );

      const emailPayload = {
        userEmail: user.email,
        userPseudo: user.pseudo,
        token,
      };

      const result = await emailClient.sendRecoveryPassword(emailPayload);

      if (!result.success) {
        const isPreProductionTest = result.messageIds.includes("xxx");
        const message = isPreProductionTest
          ? "[DEV] Emails are disabled in pre-production environment"
          : "Failed to send email";

        request.log.error(message);

        return reply.status(500).send({ clientMessage: message });
      }

      await recordNotification(
        { userId: user.id, type: "password_reset", transport: "email" },
        prisma,
      );

      await recordUserToken(
        { userId: user.id, type: "password_reset", token: token },
        prisma,
      );

      return reply
        .status(200)
        .send({ clientMessage: "Email sent successfully" });
    } catch (error) {
      return reply
        .status(500)
        .send({ clientMessage: "An unexpected error occurred", error });
    }
  };

  const sendConfirmationEmail = async (
    request: FastifyRequest<{ Body: { email: string } }>,
    reply: FastifyReply,
  ) => {
    const { email } = request.body;
    const prisma = request.server.prisma;

    const { generateToken } = useToken();
    const emailClient = new EmailService({ canSend: isProduction() });

    const { recordNotification } = notificationUseCase();
    const { recordUserToken } = userTokenUseCase();

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(404).send({ clientMessage: "User not found" });
      }

      const token = generateToken(
        { id: user.id, email: user.email },
        { type: "email_verification" },
      );

      const emailPayload = {
        userEmail: user.email,
        userPseudo: user.pseudo,
        token,
      };

      const result = await emailClient.sendEmailVerification(emailPayload);

      if (!result.success) {
        const isPreProductionTest = result.messageIds.includes("xxx");
        const message = isPreProductionTest
          ? "[DEV] Emails are disabled in pre-production environment"
          : "Failed to send email";

        request.log.error(message);

        return reply.status(500).send({ clientMessage: message });
      }

      await recordNotification(
        { userId: user.id, type: "email_verification", transport: "email" },
        prisma,
      );

      await recordUserToken(
        { userId: user.id, type: "email_verification", token: token },
        prisma,
      );

      return reply
        .status(200)
        .send({ clientMessage: "Email sent successfully" });
    } catch (error) {
      return reply
        .status(500)
        .send({ clientMessage: "An unexpected error occurred", error });
    }
  };

  return { sendReset, sendConfirmationEmail };
};
