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
import { cliApiRouter } from "@captain/cli-api";

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: cliApiRouter },
});

import { fastifyStatic } from "@fastify/static";
import path from "path";

const p = path.join(process.cwd(), "public");
console.log("\n\n\n path?", p);

// serve static assets
// TODO: Make this dynamic in dev
server.register(fastifyStatic, {
  root: path.join(process.cwd(), "web"),
});

server.get("/api", async (request, reply) => {
  return "pongin";
});

export const startServer = () => {
  server.listen({ port: 2033 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};
