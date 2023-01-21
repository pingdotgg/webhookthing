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

export const startServer = () => {
  server.listen({ port: 2033 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};
