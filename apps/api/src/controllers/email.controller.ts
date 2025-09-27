import { FastifyReply, FastifyRequest } from "fastify";
import { ForgotPasswordBody } from "../services/email.interface.js";
import { EmailService } from "../services/email.service.js";

export const EmailController = () => {
  const sendEmail = async (
    request: FastifyRequest<{ Body: ForgotPasswordBody }>,
    reply: FastifyReply,
  ) => {
    const emailClient = new EmailService();
    const { email } = request.body;
    const prisma = request.server.prisma;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(404).send({ clientMessage: "User not found" });
      }

      const emailPayload = {
        user_email: user.email,
        user_pseudo: user.pseudo,
        token: "1234567890",
      };

      const result = await emailClient.sendRecoveryPassword(emailPayload);

      if (!result.success) {
        return reply
          .status(500)
          .send({ clientMessage: "Failed to send email" });
      }

      return reply
        .status(200)
        .send({ clientMessage: "Email sent successfully" });
    } catch (error) {
      return reply
        .status(500)
        .send({ clientMessage: "Failed to send email", error });
    }
  };

  return { sendEmail };
};
