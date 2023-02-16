// Configure fastify
import fastify from "fastify";

import cors from "@fastify/cors";
import proxy from "@fastify/http-proxy";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { cliApiRouter } from "@captain/cli-core";
import { fastifyStatic } from "@fastify/static";
import path from "path";

const PORT = 2033;
const WS_PORT = 2034;

const createServer = async () => {
  const server = fastify({
    maxParamLength: 5000,
  });
  // Configure CORS
  await server.register(cors, { origin: "*" });

  // Configure proxy for Plausible
  await server.register(proxy, {
    upstream: "https://plausible.io/api/event",
    prefix: "/api/event",
  });
  // Configure tRPC
  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router: cliApiRouter },
  });

  const devMode = process.env.NODE_ENV === "development";

  if (!devMode) {
    const webPath = path.join(__dirname, "web");
    await server.register(fastifyStatic, {
      root: webPath,
    });
  } else {
    // in dev mode, serve a redirect to vite server
    server.get("/", async (req, res) => {
      await res.redirect("http://localhost:5173");
    });
  }

  return server;
};

import open from "open";

const openInBrowser = async () => {
  try {
    await open(`http://localhost:${PORT}`);
  } catch (_err) {
    console.log("\x1b[31m[ERROR] Failed to open browser automatically\x1b[0m");
    console.log(
      `[INFO] You can still manually open the web UI here: http://localhost:${PORT}`
    );
  }
};

import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";

export const startSocketServer = async () => {
  const wss = new ws.Server({
    port: WS_PORT,
  });
  const handler = applyWSSHandler({ wss, router: cliApiRouter });
  wss.on("connection", (ws) => {
    console.log(`++ Connection (${wss.clients.size})`);
    ws.once("close", () => {
      console.log(`-- Connection (${wss.clients.size})`);
    });
  });
  console.log(`[INFO] WebSocket Server listening on ws://localhost:${WS_PORT}`);
  process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
    wss.close();
  });
};

export const startServer = async () => {
  const server = await createServer();
  server.listen({ port: PORT }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (process.env.NODE_ENV === "development") {
      console.log(
        `\x1b[33m[WARNING] Running in development mode, you can access the web UI at http://localhost:5173\x1b[0m`
      );
    }
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    else if (!process.env.CI && !process.env.CODESPACES) {
      // Dont try to open the browser in CI, or on Codespaces, it will crash
      console.log(
        `[INFO] Opening webhookthing at address: http://localhost:${PORT}`
      );
      void openInBrowser();
    } else {
      console.log(
        `[INFO] Running webhookthing at address: http://localhost:${PORT}`
      );
    }

    return;
  });
};
