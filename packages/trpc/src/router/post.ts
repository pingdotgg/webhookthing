import { t } from "../trpc";

export const postRouter = t.router({
  all: t.procedure.query(async ({ ctx }) => {
    return ctx.prisma.requestObject.findMany();
  }),
});
