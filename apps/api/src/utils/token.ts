import jwt from "jsonwebtoken";

export const useToken = () => {
  const generateToken = (payload: string) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  };

  const verifyToken = (token: string) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  };

  return { generateToken, verifyToken };
};
