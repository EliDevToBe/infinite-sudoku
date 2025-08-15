// import ScalarApiReference from "@scalar/fastify-api-reference";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

export default fp(
  (server: FastifyInstance, _opts: FastifyPluginOptions, done) => {
    try {
      server.register(import("@scalar/fastify-api-reference"), {
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
          defaultHttpClient: {
            targetKey: "node",
            clientKey: "fetch",
          },
          // authentication: {
          //   securitySchemes: {
          //     apiKeyHeader: {
          //       name: "access-token",
          //       in: "header",
          //       value: "APIKEY VALUE",
          //     },
          //     // For HTTP Bearer
          //     // httpBearer: {
          //     //   token: "xyz token value",
          //     // },
          //     // // For HTTP Basic
          //     // httpBasic: {
          //     //   username: "username",
          //     //   password: "password",
          //     // },
          //   },
          // },
        },
        hooks: {
          preHandler: (_, reply, done) => {
            reply.header(
              "Content-Security-Policy",
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.scalar.com/; font-src 'self' https://fonts.scalar.com/;",
            );
            done();
          },
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      server.log.warn("⚠️ Scalar API Reference failed to load:", errorMessage);
      server.log.info("📚 API documentation available at /openapi.json");
    }

    done();
  },
);
