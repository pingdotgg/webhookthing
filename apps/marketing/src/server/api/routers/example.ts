/* eslint-disable no-console */
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../../../utils/db";

export const exampleRouter = createTRPCRouter({
  submitWaitlist: publicProcedure
    .input(
      z.object({
        endpoint: z.string().url().optional(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      console.log(
        `[INFO]: Waitlist submission received\n${JSON.stringify(
          input,
          null,
          2
        )}\n`
      );

      await db
        .insertInto("waitlist")
        .ignore() // ignore duplicates
        .values(input)
        .execute();

      return {
        success: true,
      };
    }),
});
