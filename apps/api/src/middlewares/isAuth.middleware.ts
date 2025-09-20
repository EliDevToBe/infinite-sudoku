import type { FastifyReply, FastifyRequest } from "fastify";
import { useToken } from "../utils/token.js";

const { verifyToken } = useToken();

export const isAuth = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void,
) => {
  const accessToken = request.headers["access-token"] as string;

  if (!accessToken) {
    done();
    return;
  }

  try {
    const access = verifyToken({ token: accessToken, type: "access" });

    // Decorate the request with the user.id if user is authenticated
    request.setDecorator("user", {
      id: access.id,
    });

    done();
  } catch (_error) {
    return reply.code(401).send({
      code: 401,
      message: "Unauthorized",
      error: "Invalid token",
    });
  }
};
