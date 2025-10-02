import { TokenType } from "@prisma/client";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
  email: string;
};

type AugmentedJwtPayload = JwtPayload & {
  id: string;
  email: string;
};

type TokenTypeExtended = "access" | "refresh" | TokenType;
type ExpiresInOptions = "12h" | "2d" | "5m" | "7d";

type VerifyTokenPayload = {
  token: string;
  type: TokenTypeExtended;
};

export const useToken = () => {
  if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT SECRETs are not defined");
  }

  const config: Record<
    TokenTypeExtended,
    { expiresIn: ExpiresInOptions; secret: string }
  > = {
    access: {
      expiresIn: "5m",
      secret: process.env.JWT_ACCESS_SECRET,
    },
    refresh: {
      expiresIn: "2d",
      secret: process.env.JWT_REFRESH_SECRET,
    },
    password_reset: {
      expiresIn: "12h",
      secret: process.env.JWT_ACCESS_SECRET,
    },
    email_verification: {
      expiresIn: "7d",
      secret: process.env.JWT_ACCESS_SECRET,
    },
  };

  const generateToken = (
    payload: TokenPayload,
    params: { type: TokenTypeExtended },
  ) => {
    return jwt.sign(payload, config[params.type].secret, {
      expiresIn: config[params.type].expiresIn,
    });
  };

  const verifyToken = (payload: VerifyTokenPayload) => {
    return jwt.verify(
      payload.token,
      config[payload.type].secret,
    ) as AugmentedJwtPayload;
  };

  /**
   * Checks if an access token is expired.
   * @param {JwtPayload} jwtPayload - The JWT payload to check.
   * @returns {boolean} True if the token is expired, false otherwise.
   */
  const isJwtExpired = (jwtPayload: JwtPayload) => {
    const now = Date.now() / 1000;

    return now > (jwtPayload.exp ?? 0);
  };

  return {
    generateToken,
    verifyToken,
    isJwtExpired,
  };
};
