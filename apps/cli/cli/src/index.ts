#!/usr/bin/env node
import { startServer } from "./server";
import { renderTitle } from "./utils/renderTitle";

const main = async () => {
  renderTitle();

  startServer();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
