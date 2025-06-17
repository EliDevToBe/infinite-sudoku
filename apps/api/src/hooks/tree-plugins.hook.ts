import fp from "fastify-plugin";

export default fp((server, _opts, done) => {
  server.addHook("onReady", (done) => {
    server.log.info("Plugins loading tree:");
    server.log.info(server.printPlugins());
    done();
  });
  done();
});
