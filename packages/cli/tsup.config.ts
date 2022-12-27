import { defineConfig } from "tsup";

const isDev = process.env.npm_lifecycle_event === "dev-cli";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  minify: !isDev,
  metafile: !isDev,
  sourcemap: true,
  target: "esnext",
  outDir: "dist",
  onSuccess: isDev ? "node dist/index.js" : undefined,

  publicDir: "../cli-web/dist",

  noExternal: ["@captain/cli-api"],
});
