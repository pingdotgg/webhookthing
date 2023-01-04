import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

import fs from "fs/promises";

type User = {
  id: string;
  name: string;
  bio?: string;
};
const users: Record<string, User> = {};

export const t = initTRPC.create({
  transformer: superjson,
});
export const cliApiRouter = t.router({
  getBlobs: t.procedure.query(async () => {
    return await fs.readdir(process.cwd() + "/.captain/hooks");
  }),
  getUserById: t.procedure.input(z.string()).query(({ input }) => {
    return users[input]; // input type is string
  }),
  createUser: t.procedure
    .input(
      z.object({
        name: z.string().min(3),
        bio: z.string().max(142).optional(),
      })
    )
    .mutation(({ input }) => {
      const id = Date.now().toString();
      const user: User = { id, ...input };
      users[user.id] = user;
      return user;
    }),
});

// export type definition of API
export type CliApiRouter = typeof cliApiRouter;
