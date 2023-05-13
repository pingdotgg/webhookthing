import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import fetch from "node-fetch";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import { observable } from "@trpc/server/observable";

import { openInExplorer } from "./open-folder";
import { openFile } from "./open-file";
import { getSampleHooks } from "./get-sample-hooks";
import { HOOK_PATH } from "./constants";
import { configValidator, updateConfig } from "./update-config";
import { substituteTemplate } from "./templateSubstitution";
import { getFullPath, getRoute } from "./utils/get-full-path";

export type { ConfigValidatorType } from "./update-config";
type ExtendedConfigValidatorType = ConfigValidatorType & {
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
};

import logger from "@captain/logger";

import type { LogLevels } from "@captain/logger";
import type { ConfigValidatorType } from "./update-config";

export const t = initTRPC.create({
  transformer: superjson,
});
export const cliApiRouter = t.router({
  onLog: t.procedure.subscription(() => {
    return observable<{ message: string; level: LogLevels; ts: number }>(
      (emit) => {
        const onLog = (m: {
          message: string;
          level: LogLevels;
          ts: number;
        }) => {
          emit.next(m);
        };

        logger.subscribe(onLog);

        return () => {
          logger.unsubscribe(onLog);
        };
      }
    );
  }),

  getBlobs: t.procedure
    .input(
      z.object({
        path: z.array(z.string()),
      })
    )
    .query(async ({ input }) => {
      const fullPath = getFullPath(input.path);

      logger.debug(`Getting blobs from ${fullPath}`);

      if (!fs.existsSync(fullPath)) {
        // TODO: this should probably be an error, and the frontend should handle it
        return [];
      }

      const hooks = await fsPromises.readdir(fullPath);

      const res = hooks
        .filter(
          (hookFile) =>
            hookFile.includes(".json") && !hookFile.includes(".config.json")
        )
        .map(async (hook) => {
          const bodyPromise = fsPromises.readFile(
            path.join(fullPath, hook),
            "utf-8"
          );

          const configPath = hook.replace(".json", "") + ".config.json";

          let config;
          if (fs.existsSync(path.join(fullPath, configPath))) {
            config = await fsPromises.readFile(
              path.join(fullPath, configPath),
              "utf-8"
            );
          }

          return {
            name: hook,
            body: await bodyPromise,
            config: config // TODO: validate config
              ? (JSON.parse(config) as ConfigValidatorType)
              : undefined,
          };
        });

      return Promise.all(res);
    }),

  getFilesAndFolders: t.procedure
    .input(
      z.object({
        path: z.array(z.string()),
      })
    )
    .query(({ input }) => {
      const fullPath = getFullPath(input.path);

      const dirListing: { folders: string[]; files: string[] } = {
        folders: [],
        files: [],
      };

      if (!fs.existsSync(fullPath)) {
        logger.warn(`Path ${fullPath} does not exist`);
        return dirListing;
      }

      fs.readdirSync(fullPath).forEach((file) => {
        if (fs.lstatSync(`${fullPath}/${file}`).isDirectory()) {
          dirListing.folders.push(file);
        } else {
          if (file.startsWith(".")) return; // skip hidden files
          dirListing.files.push(file);
        }
      });

      return dirListing;
    }),

  openFolder: t.procedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input }) => {
      // if running in codespace, early return
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      if (process.env.CODESPACES) {
        throw new Error(
          "Sorry, opening folders in codespaces is not supported yet."
        );
      }
      // if running over ssh, early return
      if (
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        process.env.SSH_CONNECTION ||
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        process.env.SSH_CLIENT ||
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        process.env.SSH_TTY
      ) {
        throw new Error(
          "Sorry, opening folders on remote connections is not supported yet."
        );
      }

      try {
        await openInExplorer(path.join(HOOK_PATH, input.path));
      } catch (e) {
        logger.error(
          "Failed to open folder (unless you're on Windows, then this just happens)",
          e
        );
      }
    }),

  openFile: t.procedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input }) => {
      // if running in codespace, early return
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      if (process.env.CODESPACES) {
        throw new Error(
          "Sorry, opening files in codespaces is not supported yet."
        );
      }
      // if running over ssh, early return
      if (
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        process.env.SSH_CONNECTION ||
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        process.env.SSH_CLIENT ||
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        process.env.SSH_TTY
      ) {
        throw new Error(
          "Sorry, opening files on remote connections is not supported yet."
        );
      }

      try {
        await openFile(path.join(HOOK_PATH, input.path));
      } catch (e) {
        logger.error(
          "Failed to open file (unless you're on Windows, then this just happens)",
          e
        );
      }
    }),

  getSampleHooks: t.procedure.mutation(async () => {
    await getSampleHooks();
  }),

  runFile: t.procedure
    .input(
      z.object({
        file: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { file } = input;
      let hasCustomConfig = false;
      logger.info(`Reading file ${file}`);

      let config = {
        url: "",
        query: undefined,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      } as ExtendedConfigValidatorType;

      const fileName = file.replace(".json", "");

      const configName = `${fileName}.config.json`;

      if (fs.existsSync(path.join(HOOK_PATH, configName))) {
        hasCustomConfig = true;

        logger.info(`Found ${configName}, reading it`);

        const configFileContents = await fsPromises
          .readFile(path.join(HOOK_PATH, configName))
          .then(
            (x) =>
              // TODO: validate config
              JSON.parse(x.toString()) as ExtendedConfigValidatorType
          );

        config = {
          ...config,
          ...configFileContents,
        };

        // template substitution for header values
        if (config.headers) {
          config.headers = Object.fromEntries(
            Object.entries(config.headers).map(([key, value]) => {
              return [key, substituteTemplate({ template: value })];
            })
          );
        }
      }
      const data = await fsPromises.readFile(path.join(HOOK_PATH, file));

      if (!config.url) {
        logger.error(
          `Missing URL, please add it to the configuration for this hook`
        );
        throw new Error(
          `Missing URL, please add it to the configuration for this hook`
        );
      }

      try {
        logger.info(
          `Sending to ${config.url} ${
            hasCustomConfig ? `with custom config from ${configName}` : ""
          }\n`
        );

        const fetchedResult = await fetch(config.url, {
          method: config.method,
          headers: config.headers,
          body: config.method !== "GET" ? data.toString() : undefined,
        }).then((res) => res.json());

        logger.info(
          `Got response: \n\n${JSON.stringify(fetchedResult, null, 2)}\n`
        );
        return fetchedResult;
      } catch (e) {
        if ((e as { code: string }).code === "ECONNREFUSED") {
          logger.error("Connection refused. Is the server running?");
        } else {
          logger.error(e);
        }
        throw e;
      }
    }),

  createHook: t.procedure
    .input(
      z.object({
        name: z.string(),
        body: z.string(),
        config: configValidator.optional(),
        path: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, body, config } = input;

      const fullPath = getFullPath(input.path);

      logger.info(`Creating ${name}.json`);

      await fsPromises.writeFile(path.join(fullPath, `${name}.json`), body);
      if (config?.url || config?.query || config?.headers) {
        logger.info(`Config specified, creating ${name}.config.json`);
        return await updateConfig({ name, config });
      }
    }),

  updateHook: t.procedure
    .input(
      z.object({
        name: z.string(),
        body: z.string(),
        config: configValidator.optional(),
        path: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { body, config } = input;
      const fullPath = getFullPath(input.path);

      const name = input.name.split(".json")[0];

      if (!name) throw new Error("No name");

      const bodyPath = path.join(fullPath, `${name}.json`);

      logger.info(`Updating ${bodyPath}`);

      const existingBody = await fsPromises.readFile(bodyPath, "utf-8");

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const updatedBody = {
        ...JSON.parse(existingBody),
        ...JSON.parse(body),
      };

      await fsPromises.writeFile(
        bodyPath,
        JSON.stringify(updatedBody, null, 2)
      );

      if (
        config?.url ||
        config?.query ||
        config?.headers ||
        fs.existsSync(path.join(fullPath, `${name}.config.json`))
      ) {
        logger.info(`Config specified, updating ${name}.config.json`);
        return await updateConfig({ name, config, path: fullPath });
      }
    }),

  createFolder: t.procedure
    .input(
      z.object({
        name: z.string(),
        path: z.array(z.string()).optional(),
      })
    )
    .mutation(({ input }) => {
      const pathArr = input.path ? [...input.path, input.name] : [input.name];

      const fullPath = getFullPath(pathArr);
      const route = getRoute(pathArr);

      logger.info(`Creating new folder: ${fullPath}`);

      fs.mkdirSync(fullPath);

      return {
        route: `/${route}/`,
      };
    }),

  createFile: t.procedure
    .input(
      z.object({
        name: z.string(),
        path: z.array(z.string()).optional(),
      })
    )
    .mutation(({ input }) => {
      const pathArr = input.path
        ? [...input.path, `${input.name}.json`]
        : [`${input.name}.json`];

      const fullPath = getFullPath(pathArr);
      const route = getRoute(pathArr);

      logger.info(`Creating new file: ${fullPath}`);

      fs.writeFileSync(fullPath, "{}");

      return {
        route: `/${route}`,
      };
    }),

  parseUrl: t.procedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { url } = input;

      const fullPath = path.join(
        HOOK_PATH,
        ...url.split("/").map((x) => decodeURI(x))
      );

      if (!fs.existsSync(fullPath)) {
        const d = {
          type: "notFound",
          path: decodeURI(url),
          data: {},
        } as const;

        return d;
      }

      if (url.endsWith(".json")) {
        const configPath = fullPath.replace(".json", "") + ".config.json";

        const bodyPromise = fsPromises.readFile(fullPath, "utf-8");

        const configPromise = fsPromises
          .readFile(configPath, "utf-8")
          // TODO: validate config
          .then((x) => JSON.parse(x) as ConfigValidatorType)
          .catch(() => undefined);

        const hookData = {
          name: fullPath.split("/").pop(),
          body: await bodyPromise,
          config: await configPromise,
        } as const;

        const d = {
          type: "file" as const,
          path: decodeURI(url),
          data: hookData,
        } as const;

        return d;
      } else {
        // get folders and files in folder
        const dirListing: {
          folders: string[];
          files: {
            name: string;
            body: string;
            config: ConfigValidatorType | undefined;
          }[];
        } = {
          folders: [],
          files: [],
        };

        const listingPromises = fs
          .readdirSync(fullPath)
          .map(async (maybeFile) => {
            if (fs.lstatSync(`${fullPath}/${maybeFile}`).isDirectory()) {
              dirListing.folders.push(maybeFile);
            } else {
              if (maybeFile.startsWith(".")) return; // skip hidden files
              if (maybeFile.endsWith(".config.json")) return; // skip config files

              const filePath = path.join(fullPath, maybeFile);
              const configPath = filePath.replace(".json", "") + ".config.json";

              const bodyPromise = fsPromises.readFile(filePath, "utf-8");

              const configPromise = fsPromises
                .readFile(configPath, "utf-8")
                .then((x) => JSON.parse(x) as ConfigValidatorType)
                .catch(() => undefined);

              dirListing.files.push({
                name: maybeFile,
                body: await bodyPromise,
                config: await configPromise,
              });
            }
          });

        await Promise.allSettled(listingPromises);

        const d = {
          type: "folder" as const,
          path: decodeURI(url),
          data: dirListing,
        } as const;

        return d;
      }
    }),
});

// export type definition of API
export type CliApiRouter = typeof cliApiRouter;
