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
          Members: {
            include: {
              user: true,
            },
          },
          Sources: true,
          Destinations: true,
          LocalListeners: true,
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
  deleteProjects: t.procedure
    .input(z.object({ idsToDelete: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.deleteMany({
        where: {
          id: {
            in: input.idsToDelete,
          },
        },
      });
    }),
  createSource: t.procedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string(),
        domain: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const source = await ctx.prisma.source.create({
        data: {
          name: input.name,
          domain: input.domain,
          project: {
            connect: {
              id: input.projectId,
            },
          },
        },
      });

      return source;
    }),
  deleteSource: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const source = await ctx.prisma.source.delete({
        where: {
          id: input.id,
        },
      });
    }),
  createDestination: t.procedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const destination = await ctx.prisma.destination.create({
        data: {
          name: input.name,
          url: input.url,
          project: {
            connect: {
              id: input.projectId,
            },
          },
        },
      });

      return destination;
    }),
  deleteDestination: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const destination = await ctx.prisma.destination.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
