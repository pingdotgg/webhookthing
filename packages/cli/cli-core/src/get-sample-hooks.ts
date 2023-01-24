import path from "path";
import fs from "fs";
import fetch from "node-fetch";

export async function getSampleHooks() {
  const hooksPath = process.cwd() + "/.captain/hooks/";

  // Create the directory if it doesn't exist
  if (!fs.existsSync(hooksPath)) {
    console.log(
      `\x1b[33m[Info] Could not find .captain directory, creating it now!\x1b[0m`
    );
    fs.mkdirSync(hooksPath, { recursive: true });
  }

  const files = (await fetch(
    `https://api.github.com/repos/pingdotgg/sample_hooks/contents/`
  ).then((res) => res.json())) as {
    name: string;
    download_url: string;
  }[];

  console.log(
    `\x1b[33m[Info] Downloading ${files.length} sample hooks.\x1b[0m`
  );

  for (const file of files) {
    console.log(`\x1b[33m[Info] Downloading ${file.name}.\x1b[0m`);
    const fileContent = await fetch(file.download_url).then((res) =>
      res.text()
    );
    fs.writeFileSync(path.join(hooksPath, file.name), fileContent);
  }
}
