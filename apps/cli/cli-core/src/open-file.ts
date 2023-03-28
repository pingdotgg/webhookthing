import childProcess from "child_process";
import { promisify } from "util";
import os from "os";
import fs from "fs/promises";
import path from "path";

import logger from "@captain/logger";

const promisifiedExecFile = promisify(childProcess.execFile);

const getCommand = () => {
  const plat = os
    .platform()
    .toLowerCase()
    .replace(/[0-9]/g, ``)
    .replace(`darwin`, `macos`);

  if (plat === "win") return "start";
  if (plat === "linux") return "xdg-open";
  if (plat === "macos") return "open";

  throw new Error("Idk what os this is");
};

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

export async function openFile(path: string) {
  const exists = await pathExists(path);
  const maybeFileName = path.split("/").pop();

  // create file if it doesn't exist
  if (!exists) {
    logger.warn(`Could not find ${maybeFileName ?? "file"}, creating it now!`);
    await writeFile(path, "{}");
  }

  return await promisifiedExecFile(getCommand(), [path]);
}
