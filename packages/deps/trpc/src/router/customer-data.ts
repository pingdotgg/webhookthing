import { t } from "../trpc";

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
});
