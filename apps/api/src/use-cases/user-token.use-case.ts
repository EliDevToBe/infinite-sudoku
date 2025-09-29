import { PrismaClient, TokenType } from "@prisma/client";
import { useToken } from "../utils/token.js";

type Payload = {
  userId: string;
  token: string;
  type: TokenType;
};

export const userTokenUseCase = () => {
  const { verifyToken } = useToken();

  /**
   * Record a user token request.
   * There is only 1 valid token per request type at a time.
   *
   * Workflow:
   * - Verify the token
   * - Check if there is already one or more request associated
   *    - If there is, invalidate the old requests with `used_at` set to the current date
   * - Create the new request token
   *
   * @returns Promise<UserToken> - The created user token record.
   */
  const recordUserToken = async (payload: Payload, client: PrismaClient) => {
    try {
      const decoded = verifyToken({ token: payload.token, type: "temporary" });

      if (payload.userId !== decoded.id) {
        throw new Error("Token id does not match", {
          cause: { payload },
        });
      }

      const hasAlreadyRequested = await client.user_token.findMany({
        where: {
          type: payload.type,
          user_id: payload.userId,
          used_at: null,
        },
      });

      if (hasAlreadyRequested.length > 0) {
        await client.user_token.updateMany({
          where: {
            id: { in: hasAlreadyRequested.map((item) => item.id) },
          },
          data: { used_at: new Date() },
        });
      }

      if (!decoded.exp) {
        console.error("Token expiration time is not defined", {
          payload,
          decoded,
        });

        throw new Error("Token expiration time is not defined", {
          cause: { payload },
        });
      }

      const expiresAt = new Date(decoded.exp * 1000);

      const userToken = await client.user_token.create({
        data: {
          user_id: payload.userId,
          token: payload.token,
          type: payload.type,
          expires_at: expiresAt,
        },
      });

      return userToken;
    } catch (error) {
      throw new Error("Failed to record user token", {
        cause: { error, payload },
      });
    }
  };

  return { recordUserToken };
};
