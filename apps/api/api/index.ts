import Fastify from "fastify";
import hooks from "../src/hooks";
import plugins from "../src/plugins";
import routes from "../src/routes";

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

server.register((server, _opts, done) => {
  server.prisma.$connect();
  console.info("🔌 Prisma connected 🔌");
  done();
});

server.ready((err) => {
  if (err) {
    server.log.error(err);
    server.close();
  }
});

server.get("/", (_req, res) => {
  res.send({ status: "ok" });
});

export default async (req: unknown, res: unknown) => {
  await server.ready();
  server.server.emit("request", req, res);
};
