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
  const generateToken = (payload: TokenPayload) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET are not defined");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" });
  };

  const generateAccessToken = (payload: TokenPayload) => {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT_REFRESH_SECRET are not defined");
    }

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "1h",
    });
  };

  const verifyToken = (payload: VerifyTokenPayload) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET are not defined");
    }

    return jwt.verify(
      payload.token,
      process.env.JWT_SECRET,
    ) as AugmentedJwtPayload;
  };

  const verifyAccessToken = (payload: VerifyTokenPayload) => {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT_REFRESH_SECRET are not defined");
    }

    return jwt.verify(
      payload.token,
      process.env.JWT_REFRESH_SECRET,
    ) as AugmentedJwtPayload;
  };

  /**
   * Checks if an access token is expired.
   * @param {JwtPayload} jwtPayload - The JWT payload to check.
   * @returns {boolean} True if the token is expired, false otherwise.
   */
  const isAccessExpired = (jwtPayload: JwtPayload) => {
    const now = Math.floor(Date.now() / 1000);
    return (jwtPayload.exp ?? 0) - now < 0;
  };

  return {
    generateToken,
    generateAccessToken,
    verifyToken,
    verifyAccessToken,
    isAccessExpired,
  };
};
