export interface IEmailService {
  sendRecoveryPassword(
    payload: PasswordRecoveryPayload,
  ): Promise<{ success: boolean; messageIds: string[] }>;
}

export type ForgotPasswordBody = {
  email: string;
};

export type PasswordRecoveryPayload = {
  user_email: string;
  user_pseudo: string;
  token: string;
};
