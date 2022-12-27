#!/usr/bin/env node
import { runCli } from "./cli/index";
import { logger } from "./utils/logger";
import { renderTitle } from "./utils/renderTitle";

import fastify from "fastify";

const server = fastify();

server.get("/api", async (request, reply) => {
  return "pongin";
});

const main = async () => {
  renderTitle();

  server.listen({ port: 2033 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });

  await runCli();

  // process.exit(0);
};

main().catch((err) => {
  logger.error("Aborting installation...");
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error(
      "An unknown error has occurred. Please open an issue on github with the below:"
    );
    console.log(err);
  }
  process.exit(1);
});
