import { t } from "../trpc";
import { z } from "zod";

export const customerRouter = t.router({
  allWebRequests: t.procedure.query(({ ctx }) => {
    return ctx.prisma.requestObject.findMany({
      orderBy: { timestamp: "desc" },
    });
  }),
  allProjects: t.procedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: {
        ownerId: ctx.session?.user?.id,
      },
      include: {
        owner: true,
      },
    });
  }),
  projectById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findUnique({
        where: {
          id: input.id,
        },
        include: {
          owner: true,
        },
      });
    }),
});
