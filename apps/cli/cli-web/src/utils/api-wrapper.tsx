import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { cliApi } from "./api";

export const ApiTRPCProvider = (props: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    cliApi.createClient({
      transformer: superjson,
      links: [
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
