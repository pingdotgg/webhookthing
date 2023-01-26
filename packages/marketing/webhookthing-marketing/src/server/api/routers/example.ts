import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  submitWaitlist: publicProcedure
    .input(
      z.object({
        endpoint: z.string().url().optional(),
        email: z.string().email(),
      })
    )
    .mutation(({ input }) => {
      // TODO: write the input to a database

      console.log(
        `[INFO]: Waitlist submission received\n${JSON.stringify(
          input,
          null,
          2
        )}\n`
      );
      return {
        success: true,
      };
    }),
});
