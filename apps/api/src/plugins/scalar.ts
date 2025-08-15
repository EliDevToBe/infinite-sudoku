import ScalarApiReference from "@scalar/fastify-api-reference";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    server.register(ScalarApiReference, {
      routePrefix: "/docs",
      configuration: {
        hiddenClients: [
          // Javascript
          "jquery",
          "axios",
          "ofetch",
          "xhr",
          // Node
          "undici",
          // Dart
          "http",
          // Python
          "python3",
          "requests",
          "httr",
          "httpx_sync",
          "httpx_async",
          // Rust
          "reqwest",
          // Java/Android
          "asynchttp",
          "okhttp",
          "nethttp",
          "unirest",
          // .NET
          "restsharp",
          "httpclient",
          // Ruby
          "clj_http",
          // Go
          "cohttp",
          // Go & Ruby
          "native",
          // PHP
          "guzzle",
          // cURL and other HTTP clients
          "libcurl",
          "curl",
          "httpie",
          "wget",
          // Objective-C
          "nsurlsession",
          // Powershell
          "webrequest",
          "restmethod",
          // HTTP
          "http1.1",
        ],
        metaData: {
          title: "Sudoking API",
          description: "Sudoking API Documentation of the SudoKing web app",
        },
        favicon: "../public/favicon.svg",
        defaultHttpClient: {
          targetKey: "node",
          clientKey: "fetch",
        },
      },
      hooks: {
        // onRequest: (request, reply, done) => {
        //   if (request.headers.docsToken !== "test") {
        //     reply.status(401).send({ message: "Unauthorized" });
        //     return;
        //   }
        //   done();
        // },
        preHandler: (_, reply, done) => {
          reply.header(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.scalar.com/; font-src 'self' https://fonts.scalar.com/;",
          );
          done();
        },
      },
    });
    done();
  },
);
