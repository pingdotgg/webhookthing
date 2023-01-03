// src/server/router/index.ts
import { createRouter } from "./context";
import { transformer } from "../../transformer";

// Routers
import { customerRouter } from "./customer-data";
import { webhookRouter } from "./webhooks";

export const appRouter = createRouter()
  .transformer(transformer)
  .merge("customer", customerRouter)
  .merge("webhook", webhookRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
