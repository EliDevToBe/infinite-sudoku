import Fastify from "fastify";
import routes from "./src/routes";

const server = Fastify({
  logger: true,
});

server.register(routes);
server.after((err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});

server.ready((err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});

const shutdown = async () => {
  await server.close();
};

const start = async () => {
  try {
    await server.listen({ host: "0.0.0.0", port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
