import path from "path";
import fs from "fs";
import fsPromise from "fs/promises";
import fetch from "node-fetch";

import { HOOK_PATH } from "./constants";
import logger from "@captain/logger";

export async function getSampleHooks() {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(HOOK_PATH)) {
    logger.warn(`Could not find .thing directory, creating it now!`);
    fs.mkdirSync(HOOK_PATH, { recursive: true });
  }

  const files = (await fetch(
    `https://api.github.com/repos/pingdotgg/sample_hooks/contents/`
  ).then((res) => res.json())) as {
    name: string;
    download_url: string;
  }[];

  logger.info(`Downloading ${files.length} sample hooks.`);

  const promiseMap = files.map(async (file) => {
    logger.info(`Downloading ${file.name}`);
    const fileContent = await fetch(file.download_url).then((res) =>
      res.text()
    );

    const newFilePath = path.join(HOOK_PATH, file.name);
    try {
      return await fsPromise.writeFile(newFilePath, fileContent);
    } catch (e) {
      logger.error(`Could not write file ${file.name}`);
      logger.error(e);
      throw e;
    }
  });

  return await Promise.allSettled(promiseMap);
}
