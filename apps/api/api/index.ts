import Fastify from "fastify";
import hooks from "../src/hooks";
import plugins from "../src/plugins";
import routes from "../src/routes";

const server = Fastify({
  logger: true,
});

server.register(hooks, { prefix: "/api" });
console.info("\n🪝 Hooks registered 🪝");

server.register(plugins, { prefix: "/api" });
console.info("⚡️ Plugins registered ⚡️");

server.register(routes, { prefix: "/api" });
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

// const shutdown = () => {
//   server.prisma.$disconnect();
//   server.close();
// };

// const _start = async () => {
//   try {
//     await server.listen({ host: "0.0.0.0", port: 3000 });
//   } catch (err) {
//     server.log.error(err);
//     shutdown();
//   }
// };

// Only valid for local development
// _start();

// Vercel serverless template
//
export default async (req: unknown, res: unknown) => {
  await server.ready();
  server.server.emit("request", req, res);
};

// Initialize server (but don't start listening)
// let isReady = false;
// const readyPromise = server.ready().then(() => {
//   isReady = true;
//   console.log("Fastify is ready!");
// });

// // Export the serverless handler
// export default async (req: unknown, res: unknown) => {
//   if (!isReady) await readyPromise;

//   // Forward the request to Fastify
//   server.server.emit("request", req, res);
// };

// export default server;
