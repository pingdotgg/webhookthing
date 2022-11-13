// src/server/router/index.ts
import { t } from "../trpc";
import { customerRouter } from "./customer-data";
import { webhookRouter } from "./webhooks";

export const appRouter = t.router({
  customer: customerRouter,
  webhook: webhookRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
