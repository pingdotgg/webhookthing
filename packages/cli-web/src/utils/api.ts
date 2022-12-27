import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { CLIAppRouter } from "@captain/cli/src/cli/api";

export const cliApiClient = createTRPCProxyClient<CLIAppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:2033/trpc",
    }),
  ],
});
