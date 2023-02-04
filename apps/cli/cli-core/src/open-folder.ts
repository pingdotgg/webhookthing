import childProcess from "child_process";
import { promisify } from "util";
import os from "os";
import fs from "fs";

const promisifiedExecFile = promisify(childProcess.execFile);

const getCommand = () => {
  const plat = os
    .platform()
    .toLowerCase()
    .replace(/[0-9]/g, ``)
    .replace(`darwin`, `macos`);

  if (plat === "win") return "explorer.exe";
  if (plat === "linux") return "xdg-open";
  if (plat === "macos") return "open";

  throw new Error("Idk what os this is");
};

// Ripped from https://www.npmjs.com/package/open-file-explorer
export async function openInExplorer(path: string) {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(path)) {
    console.log(
      `\x1b[33m[WARNING] Could not find .thing directory, creating it now!\x1b[0m`
    );
    fs.mkdirSync(path, { recursive: true });
  }

  return await promisifiedExecFile(getCommand(), [path]);
}
