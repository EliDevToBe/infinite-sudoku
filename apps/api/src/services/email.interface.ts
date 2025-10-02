export interface IEmailService {
  sendRecoveryPassword(
    payload: PasswordRecoveryPayload,
  ): Promise<{ success: boolean; messageIds: string[] }>;
}

export type ForgotPasswordBody = {
  email: string;
};

export type PasswordRecoveryPayload = {
  userEmail: string;
  userPseudo: string;
  token: string;
};

export type EmailVerificationPayload = {
  userEmail: string;
  userPseudo: string;
  token: string;
};
