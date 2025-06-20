import Fastify from "fastify";
import hooks from "../src/hooks";
import plugins from "../src/plugins";
import routes from "../src/routes";

const server = Fastify({
  logger:
    process.env.NODE_ENV === "develop"
      ? {
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              singleLine: true,
            },
          },
        }
      : true,
});

server.register(hooks);
server.log.info("🪝  Hooks registered 🪝");

server.register(plugins);
server.log.info("⚡️ Plugins registered ⚡️");

server.register(routes);
server.log.info("✨ Routes registered ✨\n");

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

server.get("/", (_req, res) => {
  res.send({ status: "ok" });
});

export default async (req: unknown, res: unknown) => {
  await server.ready();
  server.server.emit("request", req, res);
};
