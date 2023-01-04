#!/usr/bin/env node
import { runCli } from "./cli/index";
import { startServer } from "./cli/server";
import { logger } from "./utils/logger";
import { renderTitle } from "./utils/renderTitle";

const main = async () => {
  // renderTitle();

  startServer();
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
