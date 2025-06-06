import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async function handler(_request, _reply) {
  return { hello: "world" };
});

const shutdown = async () => {
  await fastify.close();
};

const start = async () => {
  try {
    await fastify.listen({ host: "0.0.0.0", port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
