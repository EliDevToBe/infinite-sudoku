import { MailtrapClient } from "mailtrap";
import { IEmailService, PasswordRecoveryPayload } from "./email.interface.js";

export class EmailService implements IEmailService {
  private readonly client: MailtrapClient;

  constructor() {
    if (!process.env.MAILTRAP_TOKEN) {
      throw new Error("MAILTRAP_TOKEN is not defined");
    }

    this.client = new MailtrapClient({
      token: process.env.MAILTRAP_TOKEN,
    });
  }

  async sendRecoveryPassword(
    payload: PasswordRecoveryPayload,
  ): Promise<{ success: boolean; messageIds: string[] }> {
    if (!process.env.MAILTRAP_SENDER_EMAIL) {
      throw new Error("MAILTRAP_SENDER_EMAIL is not defined");
    }
    if (!process.env.FRONTEND_URL) {
      throw new Error("FRONTEND_URL is not defined");
    }

    const { user_email, user_pseudo } = payload;

    const sender = {
      email: process.env.MAILTRAP_SENDER_EMAIL,
      name: "Infinite Sudoku",
    };

    const url = new URL(process.env.FRONTEND_URL);
    url.pathname = "/reset-password";
    url.searchParams.set("token", payload.token);

    const result = await this.client.send({
      from: sender,
      to: [{ email: user_email, name: user_pseudo }],
      template_variables: {
        user_pseudo,
        user_email,
        recovery_link: url.toString(),
      },
      template_uuid: "bd35d936-e239-4004-8553-c9d6bb1917aa",
    });

    return { success: result.success, messageIds: result.message_ids };
  }
}
