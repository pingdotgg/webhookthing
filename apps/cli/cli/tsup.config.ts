import { defineConfig } from "tsup";

const isDev = process.env.npm_lifecycle_event === "dev";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  minify: !isDev,
  metafile: !isDev,
  sourcemap: true,
  target: "esnext",
  outDir: "devbuild",
  onSuccess: isDev ? "node devbuild/index.mjs" : undefined,

  publicDir: "../cli-web/dist",

  shims: true,

  noExternal: ["@captain/cli-core"],
});
