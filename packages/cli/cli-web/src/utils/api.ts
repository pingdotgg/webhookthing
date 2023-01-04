import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { CliApiRouter } from "@captain/cli-core";
import superjson from "superjson";

export const cliApiClient = createTRPCProxyClient<CliApiRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: "http://localhost:2033/trpc",
    }),
  ],
});
