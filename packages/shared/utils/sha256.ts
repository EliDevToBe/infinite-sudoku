import { createHash } from "node:crypto";

// This is used to prevent duplicate grids in DB

/**
 * Hash a string using sha256
 * @param data - The data to hash
 * @returns The hashed string
 */
export const sha256 = (data: unknown) => {
  return createHash("sha256").update(JSON.stringify(data)).digest("hex");
};
