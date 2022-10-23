import { t } from "../trpc";

export const customerRouter = t.router({
  allWebRequests: t.procedure.query(({ ctx }) => {
    return ctx.prisma.requestObject.findMany({
      orderBy: { timestamp: "desc" },
    });
  }),
});
