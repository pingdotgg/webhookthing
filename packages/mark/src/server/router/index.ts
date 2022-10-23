// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { dataRouter } from "./data";
import { settingsRouter } from "./settings";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("data.", dataRouter)
  .merge("settings.", settingsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
