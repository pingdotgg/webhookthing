import { t } from "../trpc";
import { z } from "zod";
import { JSONObject } from "superjson/dist/types";

export const webhookRouter = t.router({
  replay: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.requestObject.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!request) {
        throw new Error("Request not found");
      }
      const forwardingUrls = await ctx.prisma.destination
        .findMany({
          where: {
            projectId: request.projectId,
          },
        })
        .then((destinations) =>
          destinations.map((destination) => destination.url)
        );

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
  getCurl: t.procedure
    .input(z.object({ id: z.string(), destination: z.string() }))
    .query(async ({ ctx, input }) => {
      const request = await ctx.prisma.requestObject.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!request) {
        throw new Error("Request not found");
      }
      const destination = await ctx.prisma.destination.findUnique({
        where: {
          id: input.destination,
        },
      });
      if (!destination) {
        throw new Error("Destination not found");
      }

      // generate curl command string from request
      const curlCommand = `curl -X ${request.method} -H "${Object.entries(
        request.headers as JSONObject
      )}" ${destination.url} -d ${request.body}`;

      return { curlCommand };
    }),
});
