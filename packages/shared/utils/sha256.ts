import { createHash } from "node:crypto";

export const sha256 = (data: unknown) => {
  return createHash("sha256").update(JSON.stringify(data)).digest("hex");
};
