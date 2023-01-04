const { writeFile } = require("fs/promises");
const { resolve } = require("path");

const ncc = require("@vercel/ncc");
const { join } = require("path");

// output directories
const DIST_DIR = resolve(__dirname, "../dist");
const ENTRY_DIR = resolve(__dirname, "../src/index.ts");

async function main() {
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
