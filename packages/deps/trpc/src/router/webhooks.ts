import { t } from "../trpc";
import { z } from "zod";
import { JSONObject } from "superjson/dist/types";

export const webhookRouter = t.router({
  replay: t.procedure
    .input(
      z.object({ id: z.string(), destinations: z.array(z.string()).optional() })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.requestObject.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!request) {
        throw new Error("Request not found");
      }
      let forwardingUrls = await ctx.prisma.destination
        .findMany({
          where: {
            projectId: request.projectId,
          },
        })
        .then((destinations) =>
          destinations.map((destination) => destination.url)
        );

      // If destinations are specified, only forward to those
      if (input.destinations) {
        forwardingUrls = forwardingUrls.filter((url) =>
          input.destinations?.includes(url)
        );
      }

      // replay the request to all destinations
      await Promise.all(
        forwardingUrls.map(async (url) => {
          await fetch(url, {
            method: request.method,
            headers: (request.headers as HeadersInit) ?? {}, // TODO: types?
            body: request.body,
          });
        })
      );

      return { success: true };
    }),
});
