const { readFile, writeFile } = require("fs/promises");
const { resolve } = require("path");

const fse = require("fs-extra");

const ncc = require("@vercel/ncc");
const { join } = require("path");

// output directories
const DIST_DIR = resolve(__dirname, "../dist");
const ENTRY_DIR = resolve(__dirname, "../src/index.ts");

const WEB_DIR = resolve(__dirname, "../../cli-web/dist/web");

async function main() {
  try {
    const indexHtml = await readFile(join(WEB_DIR, "index.html"), "utf8");
  } catch (e) {
    console.error(
      "\n\nno index html in cli-web, make sure that is built first\n\n"
    );
    console.error(e);
    process.exit(1);
  }

  fse.copySync(WEB_DIR, join(DIST_DIR, "web"));

  const input = "./index.js";
  const opts = { sourceMap: true, sourceMapRegister: true };
  const { code, map, assets } = await ncc(ENTRY_DIR, opts);
  await writeFile(join(DIST_DIR, input), code);
  await writeFile(join(DIST_DIR, `${input}.map`), map);
  for (var [assetName, assetCode] of Object.entries(assets)) {
    await writeFile(
      join(DIST_DIR, assetName),
      assetCode.source.toString("utf8")
    );
  }
  return "success";
}

main().then(console.log).catch(console.error);
