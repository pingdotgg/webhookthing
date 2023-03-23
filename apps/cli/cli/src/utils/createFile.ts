import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";

import logger from "@captain/logger";

import { HOOK_PATH } from "./forceThingExists";

const pathExists = async (path: string) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

const writeFile = async (filePath: string, data: string) => {
  try {
    const dirname = path.dirname(filePath);
    const exist = await pathExists(dirname);
    if (!exist) {
      await fs.mkdir(dirname, { recursive: true });
    }

    await fs.writeFile(filePath, data, "utf8");
  } catch (err) {
    throw err;
  }
};

export const createWebhook = async ({
  name,
  prefix,
  body,
  config,
}: {
  name: string;
  prefix: string;
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

    const hookBodyPath = path.join(HOOK_PATH, `${prefix}/${name}.json`);
    const hookConfigPath = path.join(
      HOOK_PATH,
      `${prefix}/${name}.config.json`
    );

    await writeFile(hookBodyPath, JSON.stringify(bodyJson));
    await writeFile(hookConfigPath, JSON.stringify(configJson));
  } catch (err) {
    logger.error(err);
  }

  return {
    success: true,
  };
};
