// Configure fastify
import fastify from "fastify";
export const server = fastify({
  maxParamLength: 5000,
});

// Configure CORS
import cors from "@fastify/cors";
server.register(cors, {
  origin: (origin, cb) => {
    // borrowed from fastify-cors docs
    const hostname = new URL(origin).hostname;
    if (hostname === "localhost") {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  },
});

// Configure proxy for Plausible
import proxy from "@fastify/http-proxy";
server.register(proxy, {
  upstream: "https://plausible.io/api/event",
  prefix: "/api/event",
});

// Configure tRPC
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { cliApiRouter } from "@captain/cli-core";

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: cliApiRouter },
});

import { fastifyStatic } from "@fastify/static";
import path from "path";

const devMode = process.env.NODE_ENV === "development";

if (!devMode) {
  const webPath = path.join(__dirname, "web");
  server.register(fastifyStatic, {
    root: webPath,
  });
} else {
  // in dev mode, serve a redirect to vite server
  server.get("/", async (req, res) => {
    res.redirect("http://localhost:5173");
  });
}

import open from "open";
export const startServer = () => {
  server.listen({ port: 2033 }, async (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (process.env.NODE_ENV === "development") {
      console.log(
        `\x1b[33m[WARNING] Running in development mode, you can access the web UI at http://localhost:5173\x1b[0m`
      );
    } else {
      console.log(
        `[INFO] Opening webhookthing at address: http://localhost:2033`
      );
      await open("http://localhost:2033");
    }
  });
};
