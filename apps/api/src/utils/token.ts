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
  const generateToken = (
    payload: TokenPayload,
    params: { type: TokenType },
  ) => {
    if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT SECRETs are not defined");
    }

    if (params.type === "access") {
      return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "5m",
      });
    }
    if (params.type === "refresh") {
      return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "2d",
      });
    }
    throw new Error("Invalid token type");
  };

  const verifyToken = (payload: VerifyTokenPayload) => {
    if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT SECRETs are not defined");
    }

    let secret: string;
    if (payload.type === "refresh") {
      secret = process.env.JWT_REFRESH_SECRET;
    }
    if (payload.type === "access") {
      secret = process.env.JWT_ACCESS_SECRET;
    } else {
      throw new Error("Invalid token type");
    }

    return jwt.verify(payload.token, secret) as AugmentedJwtPayload;
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
    generateToken,
    verifyToken,
    isJwtExpired,
  };
};
