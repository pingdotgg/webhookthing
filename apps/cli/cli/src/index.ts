#!/usr/bin/env node
import { startServer, startSocketServer } from "./server";
import { renderTitle } from "./utils/renderTitle";

const DOCS_LINK = "https://docs.webhookthing.com";

const main = async () => {
  renderTitle();

  // link to docs
  console.log(`\x1b[36mQuestions? Check out the docs: ${DOCS_LINK}\x1b[0m`);

  startSocketServer();

  await startServer();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
