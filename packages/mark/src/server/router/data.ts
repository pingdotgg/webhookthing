import { createProtectedRouter } from "./protected-router";

export const dataRouter = createProtectedRouter().query("get-all-requests", {
  async resolve({ ctx }) {
    return await ctx.prisma.requestObject.findMany({
      orderBy: { timestamp: "desc" },
    });
  },
});
