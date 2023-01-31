#!/usr/bin/env node
import { startServer } from "./server";
import { renderTitle } from "./utils/renderTitle";
import { getNpmVersion, renderVersionWarning } from "./utils/versionWarning";

const main = async () => {
  const npmVersion = await getNpmVersion();
  renderTitle();
  npmVersion && renderVersionWarning(npmVersion);

  startServer();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
