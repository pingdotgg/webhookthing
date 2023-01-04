// @ts-check

// Have to import env variables here for checks to work
// Since they're unused we disable the eslint rule below
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from "./src/env/server.mjs";

import withTM from "next-transpile-modules";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default withTM(["@captain/trpc", "@captain/db", "@captain/auth"])(
  defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    typescript: { ignoreBuildErrors: true },
    eslint: {
      ignoreDuringBuilds: true,
    },
    redirects: async () => [
      {
        source: "/settings",
        destination: "/settings/projects",
        permanent: false,
      },
    ],
  })
);
