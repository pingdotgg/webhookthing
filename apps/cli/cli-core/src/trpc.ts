import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

import { openInExplorer } from "./open-folder";
import { getSampleHooks } from "./get-sample-hooks";
import { HOOK_PATH } from "./constants";

export const t = initTRPC.create({
  transformer: superjson,
});
export const cliApiRouter = t.router({
  getBlobs: t.procedure.query(async () => {
    const hooks = await fs.readdir(HOOK_PATH);

    const res = hooks
      .filter((hookFile) => hookFile.includes(".json"))
      .map(async (hook) => {
        const content = await fs.readFile(path.join(HOOK_PATH, hook), "utf-8");

        return {
          name: hook,
          content: JSON.parse(content),
        };
      });

    return Promise.all(res);
  }),

  openFolder: t.procedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input }) => {
      await openInExplorer(path.join(HOOK_PATH, input.path));
    }),

  getSampleHooks: t.procedure.mutation(async () => {
    await getSampleHooks();
  }),

  runFile: t.procedure
    .input(
      z.object({
        file: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { file, url } = input;
      console.log(`[INFO] Reading file ${file}, and POST-ing to ${url}`);
      const data = await fs.readFile(path.join(HOOK_PATH, file));
      const parsedJson = JSON.parse(data.toString());

      try {
        const fetchedResult = await fetch(url, {
          method: "POST",
          body: JSON.stringify(parsedJson),
        });

        console.log(
          `[INFO] Got response: \n\n${JSON.stringify(fetchedResult, null, 2)}`
        );
        return fetchedResult;
      } catch (e) {
        console.log("[ERROR] FAILED TO SEND");
        if ((e as any).code === "ECONNREFUSED") {
          console.log("[ERROR] Connection refused. Is the server running?");
        } else {
          console.log("[ERROR] Unknown error", e);
        }
        throw new Error("Connection refused. Is the server running?");
      }
    }),
});

// export type definition of API
export type CliApiRouter = typeof cliApiRouter;
