import type { FastifyReply, FastifyRequest } from "fastify";
import { useToken } from "./token.js";

const { verifyToken, isJwtExpired, generateToken } = useToken();

export const authenticated = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void,
) => {
  const accessToken = request.headers["access-token"] as string;
  const refreshToken = request.headers["refresh-token"] as string;

  if (!accessToken || !refreshToken) {
    reply.code(401).send({ code: 401, message: "Tokens missing" });
    return;
  }

  try {
    const access = verifyToken({ token: accessToken, type: "access" });
    const hasAccessExpired = isJwtExpired(access);

    const refresh = verifyToken({
      token: refreshToken,
      type: "refresh",
    });
    const hasRefreshExpired = isJwtExpired(refresh);

    if (hasAccessExpired && !hasRefreshExpired) {
      request.headers["access-token"] = generateToken(
        {
          id: access.id,
          email: access.email,
        },
        { type: "access" },
      );
      return;
    }

    if (hasAccessExpired && hasRefreshExpired) {
      reply.headers({
        "access-token": "",
        "refresh-token": "",
      });

      const now = Date.now();
      reply.code(401).send({
        code: 401,
        message: "Session expired END",
        accessTime: access.exp ?? 0 - now,
        refreshTime: refresh.exp ?? 0 - now,
        now,
      });
      return;
    }

    done();
  } catch (_error) {
    reply.code(401).send({
      code: 401,
      message: "Unauthorized",
      error: "Invalid token",
    });
  }
};
