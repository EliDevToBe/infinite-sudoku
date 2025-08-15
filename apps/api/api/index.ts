import Fastify from "fastify";
import hooks from "../src/hooks/index.js";
import plugins from "../src/plugins/index.js";
import routes from "../src/routes/index.js";

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
  }
});

let isReady = false;

export default async (req: unknown, res: unknown) => {
  try {
    if (!isReady) {
      await server.ready();
      isReady = true;
    }
    server.server.emit("request", req, res);
  } catch (error) {
    server.log.error(error);
  }
};
