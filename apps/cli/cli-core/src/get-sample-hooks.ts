import path from "path";
import fs from "fs";
import fsPromise from "fs/promises";
import fetch from "node-fetch";
import { HOOK_PATH } from "./constants";

export async function getSampleHooks() {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(HOOK_PATH)) {
    console.log(
      `\x1b[33m[WARNING] Could not find .thing directory, creating it now!\x1b[0m`
    );
    fs.mkdirSync(HOOK_PATH, { recursive: true });
  }

  const files = (await fetch(
    `https://api.github.com/repos/pingdotgg/sample_hooks/contents/`
  ).then((res) => res.json())) as {
    name: string;
    download_url: string;
  }[];

  console.log(`[INFO] Downloading ${files.length} sample hooks.`);

  const promiseMap = files.map(async (file) => {
    console.log(`[INFO] Downloading ${file.name}`);
    const fileContent = await fetch(file.download_url).then((res) =>
      res.text()
    );

    const newFilePath = path.join(HOOK_PATH, file.name);
    try {
      return await fsPromise.writeFile(newFilePath, fileContent);
    } catch (e) {
      console.log(`[ERROR] Could not write file ${file.name}`);
      console.log(e);
      throw e;
    }
  });

  return await Promise.allSettled(promiseMap);
}
