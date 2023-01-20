// Configure fastify
import fastify from "fastify";
export const server = fastify({
  maxParamLength: 5000,
});

// Configure CORS
import cors from "@fastify/cors";
server.register(cors, { origin: "*" });

// Configure tRPC
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { cliApiRouter } from "@captain/cli-core";

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: cliApiRouter },
});

import { fastifyStatic } from "@fastify/static";
import path from "path";

const webPath = path.join(__dirname, "web");
console.log(webPath);

// serve static assets
// TODO: Make this dynamic in dev
server.register(fastifyStatic, {
  root: webPath,
});

server.get("/api", async (request, reply) => {
  return "pongin";
});

export const startServer = () => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `\x1b[33m[WARNING] Running in development mode, you can access the web UI at http://localhost:5173\x1b[0m`
    );
  } else {
    server.listen({ port: 2033 }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }
};
