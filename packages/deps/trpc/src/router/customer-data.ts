import { t } from "../trpc";
import { z } from "zod";

export const customerRouter = t.router({
  allWebRequests: t.procedure.query(({ ctx }) => {
    return ctx.prisma.requestObject.findMany({
      where: {
        project: {
          Members: {
            some: {
              userId: ctx.session?.user?.id,
            },
          },
        },
      },
      orderBy: { timestamp: "desc" },
    });
  }),
  allProjects: t.procedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: {
        Members: {
          some: {
            userId: ctx.session?.user?.id,
            role: "OWNER",
          },
        },
      },
      include: {
        Members: true,
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
          Members: true,
        },
      });
    }),
  createProject: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          Members: {
            create: {
              role: "OWNER",
              user: {
                connect: {
                  id: ctx.session?.user?.id,
                },
              },
            },
          },
        },
      });

      return project;
    }),
});
