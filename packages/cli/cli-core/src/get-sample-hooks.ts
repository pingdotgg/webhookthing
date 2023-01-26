import path from "path";
import fs from "fs";
import fsPromise from "fs/promises";
import fetch from "node-fetch";

export async function getSampleHooks() {
  const hooksPath = process.cwd() + "/.captain/hooks/";

  // Create the directory if it doesn't exist
  if (!fs.existsSync(hooksPath)) {
    console.log(
      `\x1b[33m[WARNING] Could not find .captain directory, creating it now!\x1b[0m`
    );
    fs.mkdirSync(hooksPath, { recursive: true });
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
    fsPromise.writeFile(path.join(hooksPath, file.name), fileContent);
  });

  return await Promise.allSettled(promiseMap);
}
