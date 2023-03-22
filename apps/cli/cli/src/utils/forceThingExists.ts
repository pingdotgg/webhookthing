import fs from "fs/promises";
import path from "path";

import logger from "@captain/logger";

export const THING_PATH = path.join(process.cwd(), ".thing");
export const HOOK_PATH = path.join(THING_PATH, "hooks");

export default async function forceThingExists() {
  try {
    await fs.access(THING_PATH);
  } catch (error) {
    logger.warn("No .thing directory found, creating one now.");
    await fs.mkdir(THING_PATH);
  }

  try {
    await fs.access(HOOK_PATH);
  } catch (error) {
    logger.warn("No .thing/hooks directory found, creating one now.");
    await fs.mkdir(HOOK_PATH);
  }
}
