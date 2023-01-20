import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import fetch from "node-fetch";

import fs from "fs/promises";

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
    return await fs.readdir(process.cwd() + "/.captain/hooks");
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
