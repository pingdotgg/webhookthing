import fs from "fs/promises";
import path from "path";

import logger from "@captain/logger";

import { HOOK_PATH } from "./forceThingExists";

export const createWebhook = async ({
  name,
  body,
  config,
}: {
  name: string;
  body: string;
  config?: string;
}) => {
  try {
    logger.info("Got webhook creation request, fetching json...");
    // fetch the json from the urls
    const bodyJson = await fetch(body).then((res) => res.json());
    const configJson = config
      ? await fetch(config).then((res) => res.json())
      : {};

    // TODO: validate the json?

    logger.info("Got json, creating files...");
    // create the files
    const hookBodyPath = path.join(HOOK_PATH, `external/${name}.json`);
    const hookConfigPath = path.join(HOOK_PATH, `external/${name}.config.json`);

    await fs.writeFile(hookBodyPath, JSON.stringify(bodyJson));
    await fs.writeFile(hookConfigPath, JSON.stringify(configJson));
  } catch (err) {
    logger.error(err);
  }

  return {
    success: true,
  };
};
