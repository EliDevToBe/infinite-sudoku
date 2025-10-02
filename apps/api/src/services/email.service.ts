import { MailtrapClient } from "mailtrap";
import {
  EmailVerificationPayload,
  IEmailService,
  PasswordRecoveryPayload,
} from "./email.interface.js";

export class EmailService implements IEmailService {
  private readonly client: MailtrapClient;
  private readonly sender: { email: string; name: string };

  constructor(readonly config: { canSend: boolean }) {
    if (!process.env.MAILTRAP_TOKEN) {
      throw new Error("MAILTRAP_TOKEN is not defined");
    }
    if (!process.env.MAILTRAP_SENDER_EMAIL) {
      throw new Error("MAILTRAP_SENDER_EMAIL is not defined");
    }

    this.client = new MailtrapClient({
      token: process.env.MAILTRAP_TOKEN,
    });

    this.sender = {
      email: process.env.MAILTRAP_SENDER_EMAIL,
      name: "Infinite Sudoku",
    };
  }

  async sendRecoveryPassword(
    payload: PasswordRecoveryPayload,
  ): Promise<{ success: boolean; messageIds: string[] }> {
    if (!process.env.FRONTEND_URL) {
      throw new Error("FRONTEND_URL is not defined");
    }

    const { userEmail, userPseudo } = payload;

    const url = new URL(process.env.FRONTEND_URL);
    url.pathname = "/user/password-reset";
    url.searchParams.set("t", payload.token);

    if (!this.config.canSend) {
      console.warn(
        "[EmailService] Sending email is disabled in pre-production environment",
      );
      return { success: false, messageIds: ["xxx"] };
    }

    const result = await this.client.send({
      from: this.sender,
      to: [{ email: userEmail, name: userPseudo }],
      template_variables: {
        user_pseudo: userPseudo,
        user_email: userEmail,
        recovery_link: url.toString(),
      },
      template_uuid: "bd35d936-e239-4004-8553-c9d6bb1917aa",
    });

    return { success: result.success, messageIds: result.message_ids };
  }

  async sendEmailVerification(
    payload: EmailVerificationPayload,
  ): Promise<{ success: boolean; messageIds: string[] }> {
    if (!process.env.FRONTEND_URL) {
      throw new Error("FRONTEND_URL is not defined");
    }

    const { userEmail, userPseudo, token } = payload;

    const url = new URL(process.env.FRONTEND_URL);
    url.pathname = "/play";
    url.searchParams.set("t", token);

    if (!this.config.canSend) {
      console.warn(
        "[EmailService] Sending email is disabled in pre-production environment",
      );
      return { success: false, messageIds: ["xxx"] };
    }

    const result = await this.client.send({
      from: this.sender,
      to: [{ email: userEmail, name: userPseudo }],
      template_variables: {
        user_pseudo: userPseudo,
        user_email: userEmail,
        confirm_link: url.toString(),
      },
      template_uuid: "7be6ce15-4fa4-4631-9133-1673e7021c17",
    });

    return { success: result.success, messageIds: result.message_ids };
  }
}
