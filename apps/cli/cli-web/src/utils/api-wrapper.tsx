import { createWSClient, httpBatchLink, wsLink } from "@trpc/client";
import superjson from "superjson";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { cliApi } from "./api";

// create persistent WebSocket connection
const wsClient = createWSClient({
  url: `ws://localhost:3001`,
});

export const ApiTRPCProvider = (props: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    cliApi.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: "http://localhost:2033/trpc",
        }),
        wsLink({
          client: wsClient,
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
