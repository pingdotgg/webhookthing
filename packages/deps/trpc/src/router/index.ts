// src/server/router/index.ts
import { t } from "../trpc";
import { customerRouter } from "./customer-data";

import { postRouter } from "./post";

export const appRouter = t.router({
  post: postRouter,
  customer: customerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
