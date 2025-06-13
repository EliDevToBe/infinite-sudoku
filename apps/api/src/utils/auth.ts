import type { FastifyReply, FastifyRequest } from "fastify";
import { useToken } from "./token";

const { verifyToken } = useToken();

export const authenticated = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void,
) => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    reply.code(401).send({ code: 401, message: "Unauthorized" });
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    reply.code(401).send({ code: 401, message: "Unauthorized" });
    return;
  }

  done();
};
