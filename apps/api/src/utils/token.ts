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

type TokenType = "access" | "refresh";

type VerifyTokenPayload = {
  token: string;
  type: TokenType;
};

export const useToken = () => {
  const generateRefreshToken = (payload: TokenPayload) => {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT_REFRESH_SECRET are not defined");
    }

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "2d",
    });
  };
  const verifyRefreshToken = (payload: VerifyTokenPayload) => {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT_REFRESH_SECRET are not defined");
    }

    return jwt.verify(
      payload.token,
      process.env.JWT_REFRESH_SECRET,
    ) as AugmentedJwtPayload;
  };

  const generateAccessToken = (payload: TokenPayload) => {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET are not defined");
    }

    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "5m",
    });
  };
  const verifyAccessToken = (payload: VerifyTokenPayload) => {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET are not defined");
    }

    return jwt.verify(
      payload.token,
      process.env.JWT_ACCESS_SECRET,
    ) as AugmentedJwtPayload;
  };

  /**
   * Checks if an access token is expired.
   * @param {JwtPayload} jwtPayload - The JWT payload to check.
   * @returns {boolean} True if the token is expired, false otherwise.
   */
  const isJwtExpired = (jwtPayload: JwtPayload) => {
    const now = Date.now();
    return now > (jwtPayload.exp ?? 0);
  };

  return {
    generateRefreshToken,
    verifyRefreshToken,
    generateAccessToken,
    verifyAccessToken,
    isJwtExpired,
  };
};
