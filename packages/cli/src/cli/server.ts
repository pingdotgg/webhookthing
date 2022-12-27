import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import fastify from "fastify";
import { appRouter } from "./api";

export const server = fastify({
  maxParamLength: 5000,
});
server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter },
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
