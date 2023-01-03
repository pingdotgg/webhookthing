import { createTRPCRouter } from "./trpc";

import { customerRouter } from "./routers/customer-data";
import { webhookRouter } from "./routers/webhooks";

export const appRouter = createTRPCRouter({
  customer: customerRouter,
  webhook: webhookRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
