import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const webhookRouter = createTRPCRouter({
  replay: publicProcedure
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
      let forwardingUrls = (await ctx.prisma.destination
        .findMany({
          where: {
            projectId: request.projectId,
          },
        })
        .then((destinations) =>
          destinations
            .map((destination) => {
              // If destinations are specified, only forward to those
              if (input.destinations) {
                if (input.destinations.includes(destination.id)) {
                  return destination.url;
                }
              } else {
                return destination.url;
              }
            })
            .filter((x) => x !== undefined)
        )) as string[];

      // replay the request to all destinations
      await Promise.all(
        forwardingUrls.map(async (url) => {
          const fwdHost = url.match(
            /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
          )?.[1] as string;

          const options = ["GET", "HEAD"].includes(request.method)
            ? {
                method: request.method,
                headers: {
                  ...(request.headers as HeadersInit),
                  host: fwdHost,
                },
              }
            : {
                method: request.method,
                headers: {
                  ...(request.headers as HeadersInit),
                  host: fwdHost,
                },
                body: request.body,
              };

          await fetch(url, options);
        })
      );

      return { success: true };
    }),
});
