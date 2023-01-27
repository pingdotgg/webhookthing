import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import fetch from "node-fetch";
import fs from "fs/promises";

import { openInExplorer } from "./open-folder";
import { getSampleHooks } from "./get-sample-hooks";

export const t = initTRPC.create({
  transformer: superjson,
});
export const cliApiRouter = t.router({
  getBlobs: t.procedure.query(async () => {
    const hooks = await fs.readdir(process.cwd() + "/.captain/hooks");

    const res = hooks
      .filter((hookFile) => hookFile.includes(".json"))
      .map(async (hook) => {
        const content = await fs.readFile(
          process.cwd() + "/.captain/hooks/" + hook,
          "utf-8"
        );

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
      await openInExplorer(process.cwd() + "/.captain/hooks/" + input.path);
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
      const data = await fs.readFile(process.cwd() + "/.captain/hooks/" + file);
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
        console.error(e);
      }
    }),
});

// export type definition of API
export type CliApiRouter = typeof cliApiRouter;