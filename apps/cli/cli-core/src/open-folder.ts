import childProcess from "child_process";
import { promisify } from "util";
import os from "os";
import fs from "fs";

const promisifiedExecFile = promisify(childProcess.execFile);

// Ripped from https://www.npmjs.com/package/open-file-explorer
export async function openInExplorer(path: string) {
  let cmd = ``;
  switch (
    os.platform().toLowerCase().replace(/[0-9]/g, ``).replace(`darwin`, `macos`)
  ) {
    case `win`:
      path = path || "=";
      cmd = `start`;
      break;
    case `linux`:
      path = path || "/";
      cmd = `xdg-open`;
      break;
    case `macos`:
      path = path || "/";
      cmd = `open`;
      break;
  }

  // Create the directory if it doesn't exist
  if (!fs.existsSync(path)) {
    console.log(
      `\x1b[33m[WARNING] Could not find .thing directory, creating it now!\x1b[0m`
    );
    fs.mkdirSync(path, { recursive: true });
  }

  const p = await promisifiedExecFile(cmd, [path]);
}
