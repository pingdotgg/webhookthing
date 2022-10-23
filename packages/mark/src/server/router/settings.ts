import fs from "fs";
import os from "os";

import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { env } from "../../env/server.mjs";

const setEnvValue = (key: string, value: string) => {
  // if dev, update .env
  if (env.NODE_ENV === "development") {
    const envVars = fs.readFileSync(".env", "utf-8").split(os.EOL);
    const targetLine = envVars.find((line) => line.split("=")[0] === key);
    if (targetLine !== undefined) {
      // update existing line
      const targetLineIndex = envVars.indexOf(targetLine);
      // replace the key/value with the new value
      envVars.splice(targetLineIndex, 1, `${key}="${value}"`);
    } else {
      // create new key value
      envVars.push(`${key}="${value}"`);
    }
    // write everything back to the file system
    fs.writeFileSync(".env", envVars.join(os.EOL));
    return;
  }

  // if prod, update vercel
  if (env.NODE_ENV === "production" && env.VERCEL === 1) {
    fetch(
      `https://api.vercel.com/v9/projects/${env.VERCEL_PROJECT}/env/${env.FORWARDING_URL_ENV_VAR_ID}`,
      {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${env.VERCEL_API_TOKEN}`,
        },
        body: JSON.stringify({ key, value, target: ["production"] }),
      }
    );
    return;
  }
};

export const settingsRouter = createProtectedRouter()
  .mutation("update-main-forwarding-url", {
    input: z.object({
      newUrl: z.string(),
    }),
    async resolve({ input }) {
      // update local running environment
      env.MAIN_FORWARDING_URL = input.newUrl;

      // update persisted value
      setEnvValue("MAIN_FORWARDING_URL", input.newUrl);
    },
  })
  .query("get-main-forwarding-url", {
    async resolve() {
      return env.MAIN_FORWARDING_URL;
    },
  });
