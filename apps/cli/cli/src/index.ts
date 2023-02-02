#!/usr/bin/env node
import { startServer } from "./server";
import { renderTitle } from "./utils/renderTitle";

const DOCS_LINK = "https://docs.webhookthing.com";

const main = async () => {
  renderTitle();

  //link to docs
  console.log(
    `\x1b[36m%s\x1b[0m`,
    `Questions? Check out the docs: ${DOCS_LINK}`
  );

  startServer();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
