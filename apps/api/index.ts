import Fastify from "fastify";
import hooks from "./src/hooks";
import plugins from "./src/plugins";
import routes from "./src/routes";
import "node:process";

const server = Fastify({
  logger: true,
});

server.register(hooks);
console.info("\n🪝 Hooks registered 🪝");

server.register(plugins);
console.info("⚡️ Plugins registered ⚡️");

server.register(routes);
console.info("✨ Routes registered ✨\n");

server.after((err) => {
  if (err) {
    server.log.error(err);
    server.close();
  }
});

server.ready((err) => {
  if (err) {
    server.log.error(err);
    server.close();
  }
});

const shutdown = async () => {
  await server.prisma.$disconnect();
  await server.close();
};

const start = async () => {
  try {
    await server.listen({ host: "0.0.0.0", port: 3000 });
  } catch (err) {
    server.log.error(err);
    server.close();
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
