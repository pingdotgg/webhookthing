// Configure fastify
import fastify from "fastify";

import cors from "@fastify/cors";
import proxy from "@fastify/http-proxy";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { cliApiRouter } from "@captain/cli-core";
import { fastifyStatic } from "@fastify/static";
import path from "path";

import logger from "@captain/logger";

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
    logger.error("Failed to open browser automatically");
    logger.info(
      `You can still manually open the web UI here: http://localhost:${PORT}`
    );
  }
};

import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";

export const startSocketServer = () => {
  const wss = new ws.Server({
    port: WS_PORT,
  });
  const handler = applyWSSHandler({ wss, router: cliApiRouter });
  wss.on("connection", (ws) => {
    if (process.env.NODE_ENV === "development")
      logger.debug(`Websocket Connection ++ (${wss.clients.size})`);
    ws.once("close", () => {
      if (process.env.NODE_ENV === "development")
        logger.debug(`Websocket Connection -- (${wss.clients.size})`);
    });
  });
  if (process.env.NODE_ENV === "development")
    logger.debug(`WebSocket Server listening on ws://localhost:${WS_PORT}`);
  process.on("SIGTERM", () => {
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
      logger.warn(
        `Running in development mode, you can access the web UI at http://localhost:5173`
      );
    }
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    else if (!process.env.CI && !process.env.CODESPACES) {
      // Dont try to open the browser in CI, or on Codespaces, it will crash
      logger.info(`Opening webhookthing at address: http://localhost:${PORT}`);
      void openInBrowser();
    } else {
      logger.info(`Running webhookthing at address: http://localhost:${PORT}`);
    }

    process.on("SIGTERM", () => {
      server.close();
    });
  });
};
