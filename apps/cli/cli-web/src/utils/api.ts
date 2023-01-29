import type { CliApiRouter } from "@captain/cli-core";
import { createTRPCReact } from "@trpc/react-query";

type LocalType = CliApiRouter;

export const cliApi = createTRPCReact<LocalType>({});
