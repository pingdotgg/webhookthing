// src/utils/trpc.ts
import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@captain/trpc";
import { transformer } from "@captain/trpc/transformer";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url

  // eslint-disable-next-line
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  // eslint-disable-next-line
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});
