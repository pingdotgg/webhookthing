import childProcess from "child_process";
import { promisify } from "util";
import os from "os";

const promisifiedExecFile = promisify(childProcess.execFile);

// Ripped from https://www.npmjs.com/package/open-file-explorer
export async function openInExplorer(path: string) {
  var cmd = ``;
  switch (
    os.platform().toLowerCase().replace(/[0-9]/g, ``).replace(`darwin`, `macos`)
  ) {
    case `win`:
      path = path || "=";
      cmd = `explorer`;
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
  let p = await promisifiedExecFile(cmd, [path]);
}
