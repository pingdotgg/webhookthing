import { z } from "zod";

import { createRouter } from "./context";

export const customerRouter = createRouter()
  .query("allWebRequests", {
    resolve: async ({ ctx }) => {
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
    },
  })
  .query("allProjects", {
    resolve: async ({ ctx }) => {
      return ctx.prisma.project.findMany({
        where: {
          Members: {
            some: {
              userId: ctx.session?.user?.id,
              role: {
                in: ["OWNER", "ADMIN"],
              },
            },
          },
        },
        include: {
          Members: {
            include: {
              user: true,
            },
          },
        },
      });
    },
  })
  .query("allDestinations", {
    resolve: async ({ ctx }) => {
      return ctx.prisma.destination.findMany({
        where: {
          project: {
            Members: {
              some: {
                userId: ctx.session?.user?.id,
              },
            },
          },
        },
      });
    },
  })
  .query("projectById", {
    input: z.object({ id: z.string() }),
    resolve: async ({ ctx, input }) => {
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
          PendingMembers: true,

          Sources: true,
          Destinations: true,
          LocalListeners: true,
        },
      });
    },
  })
  .query("getSourceById", {
    input: z.object({ id: z.string() }),
    resolve: async ({ ctx, input }) => {
      return ctx.prisma.source.findUnique({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("createProject", {
    input: z.object({ name: z.string() }),
    resolve: async ({ ctx, input }) => {
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
    },
  })
  .mutation("deleteProjects", {
    input: z.object({ idsToDelete: z.array(z.string()) }),
    resolve: async ({ ctx, input }) => {
      // Delete everything associated with the project first
      await ctx.prisma.requestObject.deleteMany({
        where: {
          projectId: {
            in: input.idsToDelete,
          },
        },
      });
      await ctx.prisma.projectMember.deleteMany({
        where: {
          projectId: {
            in: input.idsToDelete,
          },
        },
      });
      await ctx.prisma.pendingProjectMember.deleteMany({
        where: {
          projectId: {
            in: input.idsToDelete,
          },
        },
      });
      await ctx.prisma.source.deleteMany({
        where: {
          projectId: {
            in: input.idsToDelete,
          },
        },
      });
      await ctx.prisma.destination.deleteMany({
        where: {
          projectId: {
            in: input.idsToDelete,
          },
        },
      });
      await ctx.prisma.localListener.deleteMany({
        where: {
          projectId: {
            in: input.idsToDelete,
          },
        },
      });
      // Delete the project
      await ctx.prisma.project.deleteMany({
        where: {
          id: {
            in: input.idsToDelete,
          },
        },
      });
      return true;
    },
  })
  .mutation("createSource", {
    input: z.object({
      projectId: z.string(),
      name: z.string(),
      domain: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
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
    },
  })
  .mutation("updateSource", {
    input: z.object({
      id: z.string(),
      name: z.string(),
      domain: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const source = await ctx.prisma.source.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          domain: input.domain,
        },
      });
    },
  })
  .mutation("deleteSource", {
    input: z.object({ id: z.string() }),
    resolve: async ({ ctx, input }) => {
      const source = await ctx.prisma.source.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("createDestination", {
    input: z.object({
      projectId: z.string(),
      name: z.string(),
      url: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
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
    },
  })
  .mutation("updateDestination", {
    input: z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const destination = await ctx.prisma.destination.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          url: input.url,
        },
      });
    },
  })
  .mutation("deleteDestination", {
    input: z.object({ id: z.string() }),
    resolve: async ({ ctx, input }) => {
      const destination = await ctx.prisma.destination.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("deleteListener", {
    input: z.object({ id: z.string() }),
    resolve: async ({ ctx, input }) => {
      const listener = await ctx.prisma.localListener.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("addMemberToProject", {
    input: z.object({
      projectId: z.string(),
      email: z.string(),
      role: z.enum(["ADMIN", "VIEWER"]),
    }),
    resolve: async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        // User does not exist in the database yet, create pending user, send email to invite them.

        const pendingMember = await ctx.prisma.pendingProjectMember.create({
          data: {
            email: input.email,
            role: input.role,
            project: {
              connect: {
                id: input.projectId,
              },
            },
          },
        });

        // TODO: Send email to invite user

        return pendingMember;
      }

      const member = await ctx.prisma.projectMember.create({
        data: {
          role: input.role,
          user: {
            connect: {
              id: user.id,
            },
          },
          project: {
            connect: {
              id: input.projectId,
            },
          },
        },
      });

      return member;
    },
  })
  .mutation("removeMemberFromProject", {
    input: z.object({
      projectId: z.string(),
      userId: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const member = await ctx.prisma.projectMember.delete({
        where: {
          projectId_userId: {
            userId: input.userId,
            projectId: input.projectId,
          },
        },
      });

      return member;
    },
  })
  .mutation("updateMemberRole", {
    input: z.object({
      projectId: z.string(),
      userId: z.string(),
      role: z.enum(["ADMIN", "VIEWER"]),
    }),
    resolve: async ({ ctx, input }) => {
      const member = await ctx.prisma.projectMember.update({
        where: {
          projectId_userId: {
            userId: input.userId,
            projectId: input.projectId,
          },
        },
        data: {
          role: input.role,
        },
      });

      return member;
    },
  })
  .mutation("removePendingMember", {
    input: z.object({
      projectId: z.string(),
      email: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const member = await ctx.prisma.pendingProjectMember.delete({
        where: {
          projectId_email: {
            email: input.email,
            projectId: input.projectId,
          },
        },
      });

      return member;
    },
  })
  .mutation("updatePendingMemberRole", {
    input: z.object({
      projectId: z.string(),
      email: z.string(),
      role: z.enum(["ADMIN", "VIEWER"]),
    }),
    resolve: async ({ ctx, input }) => {
      const member = await ctx.prisma.pendingProjectMember.update({
        where: {
          projectId_email: {
            email: input.email,
            projectId: input.projectId,
          },
        },
        data: {
          role: input.role,
        },
      });

      return member;
    },
  });
