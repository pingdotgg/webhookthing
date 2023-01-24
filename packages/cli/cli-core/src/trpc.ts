import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import fetch from "node-fetch";

import fs from "fs/promises";
import { openInExplorer } from "./open-folder";
import { getSampleHooks } from "./get-sample-hooks";

type User = {
  id: string;
  name: string;
  bio?: string;
};

export const t = initTRPC.create({
  transformer: superjson,
});
export const cliApiRouter = t.router({
  getBlobs: t.procedure.query(async () => {
    const hooks = await fs.readdir(process.cwd() + "/.captain/hooks");

    const res = hooks.map(async (hook) => {
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
      openInExplorer(process.cwd() + "/.captain/hooks/" + input.path);
    }),

  getSampleHooks: t.procedure.mutation(async () => {
    getSampleHooks();
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
      console.log("reading file", file, "and calling url", url);
      const data = await fs.readFile(process.cwd() + "/.captain/hooks/" + file);
      const parsedJson = JSON.parse(data.toString());
      console.log("parsed? aaa", parsedJson);

      try {
        const fetchedResult = await fetch(url, {
          method: "POST",
          body: JSON.stringify(parsedJson),
        });

        console.log("result?", fetchedResult);
        return fetchedResult;
      } catch (e) {
        console.error(e);
      }
    }),
});

// export type definition of API
export type CliApiRouter = typeof cliApiRouter;
