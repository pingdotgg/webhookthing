// This file is heavily based on the following example
// https://github.com/styfle/ncc-bug-stack/blob/master/build.js#L7
const { readFile, writeFile, rmdir, mkdir } = require("fs/promises");
const { resolve } = require("path");

const fse = require("fs-extra");

const ncc = require("@vercel/ncc");
const { join } = require("path");

// output directories
const DIST_DIR = resolve(__dirname, "../dist");
const ENTRY_DIR = resolve(__dirname, "../src/index.ts");

const WEB_DIR = resolve(__dirname, "../../cli-web/dist/web");
const README_PATH = resolve(__dirname, "../../cli/README.md");

const generatePackageJson = () => {
  const {
    name,
    version,
    main,
    exports,
    type,
    engines,
  } = require("../package.json");

  return JSON.stringify(
    {
      name,
      version,
      main,
      exports,
      type,
      engines,
      bin: {
        webhookthing: "./index.js",
      },
    },
    null,
    2
  );
};

async function runBuild() {
  // Assert that we actually have a built cli-web app to bundle
  try {
    const indexHtml = await readFile(join(WEB_DIR, "index.html"), "utf8");
  } catch (e) {
    console.error(
      "\n\nno index html in cli-web, make sure that is built first\n\n"
    );
    console.error(e);
    process.exit(1);
  }

  try {
    await rmdir(DIST_DIR, { recursive: true });
    console.log("[INFO] Dist directory removed successfully");
  } catch (e) {
    console.log("[INFO] Dist directory does not exist, skipping removal step");
  }

  await mkdir(DIST_DIR);

  // THIS IS WHERE THE CLI-WEB APP GETS BUNDLED
  fse.copySync(WEB_DIR, join(DIST_DIR, "web"));

  // Build and bundle CLI using ncc
  const opts = {
    sourceMap: true,
    sourceMapRegister: true,
    minify: true,
    transpileOnly: true,
  };
  const { code, map, assets } = await ncc(ENTRY_DIR, opts);

  // Write files to dist dir
  // THIS IS WHERE THE CLI GETS BUNDLED
  await writeFile(join(DIST_DIR, "./index.js"), code);
  await writeFile(join(DIST_DIR, "./index.js.map"), map);

  // Custom package.json
  await writeFile(join(DIST_DIR, "./package.json"), generatePackageJson());

  // Include readme.md
  await writeFile(join(DIST_DIR, "./README.md"), await readFile(README_PATH));

  // There's a bunch of "asset" files (js files from other shit)
  // Most of them come from Fastify I think?
  for (var [assetName, assetCode] of Object.entries(assets)) {
    if (assetName.includes(".json")) continue;

    console.log("[INFO] NCC writing file: ", assetName);
    await writeFile(
      join(DIST_DIR, assetName),
      assetCode.source.toString("utf8")
    );
  }
  return "[INFO] Build was successful.";
}

runBuild().then(console.log).catch(console.error);
