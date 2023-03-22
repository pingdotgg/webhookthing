#!/usr/bin/env node
import { startServer, startExternalServer, startSocketServer } from "./server";
import { renderTitle } from "./utils/renderTitle";

const DOCS_LINK = "https://docs.webhookthing.com";

const main = async () => {
  renderTitle();

  // eslint-disable-next-line no-console
  console.log(`\x1b[36mQuestions? Check out the docs: ${DOCS_LINK}\x1b[0m`);

  startSocketServer();

  await startServer();
  await startExternalServer();
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
