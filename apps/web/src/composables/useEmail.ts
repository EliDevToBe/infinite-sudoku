import { throwFrontError } from "@/utils/error";

export const useEmail = () => {
  const sendConfirmationEmail = async (email: string) => {
    const emailResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/email/confirm-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    const emailData = await emailResponse.json();
    const emailMessage = emailData.clientMessage;

    if (!emailResponse.ok && emailMessage) {
      throwFrontError(emailMessage, {
        email,
      });
    }

    return true;
  };

  const sendResetPasswordEmail = async (email: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/email/forgot-password`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    const message = data.clientMessage;

    if (!response.ok && message) {
      throwFrontError(message, {
        email,
      });
    }

    return data as { email: string; clientMessage: string };
  };

  return { sendConfirmationEmail, sendResetPasswordEmail };
};
