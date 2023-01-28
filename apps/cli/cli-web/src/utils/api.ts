import type { CliApiRouter } from "@captain/cli-core";
import { createTRPCReact } from "@trpc/react-query";

export const cliApi = createTRPCReact<CliApiRouter>({});
