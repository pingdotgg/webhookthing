import { createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import superjson from "superjson";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

const WS_PORT = 2034;

// create persistent WebSocket connection
const wsClient = createWSClient({
  url: `ws://localhost:${WS_PORT}`,
});

import { cliApi } from "./api";

export const ApiTRPCProvider = (props: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    cliApi.createClient({
      transformer: superjson,
      links: [
        splitLink({
          // subscriptions are handled by WebSocket, everything else is handled by HTTP
          condition(op) {
            return op.type === "subscription";
          },
          true: wsLink({
            client: wsClient,
          }),
          false: httpBatchLink({
            url: "http://localhost:2033/trpc",
          }),
        }),
        httpBatchLink({
          url: "http://localhost:2033/trpc",
        }),
      ],
    })
  );

  return (
    <cliApi.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </cliApi.Provider>
  );
};
