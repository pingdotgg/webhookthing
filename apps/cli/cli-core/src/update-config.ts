import { z } from "zod";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import { HOOK_PATH } from "./constants";

export const configValidator = z.object({
  url: z.string().optional(),
  query: z.record(z.string()).optional(),
  headers: z.record(z.string()).optional(),
});

export type ConfigValidatorType = z.infer<typeof configValidator>;

export const updateConfig = async (input: {
  name: string;
  config?: ConfigValidatorType;
  path?: string;
}) => {
  const { name, config } = input;

  if (!config) {
    return;
  }
  // If there is a URL, make sure it is a valid one
  if (config?.url) {
    z.string().url().parse(config.url);
  }

  // Remove empty values from config
  Object.keys(config).forEach((key) => {
    if (
      config[key as keyof typeof config] === "" ||
      JSON.stringify(config[key as keyof typeof config]) === "{}"
    ) {
      delete config[key as keyof typeof config];
    }
  });

  // Generate config file path
  const configPath = path.join(input.path ?? "",`${name}.config.json`)

  // Create config file if it doesn't exist
  if (!fs.existsSync(configPath)) {
    await fsPromises.writeFile(
      configPath,
      JSON.stringify(config, null, 2)
    );
  } else {
    // Otherwise, update existing config file
    const existingConfig = await fsPromises.readFile(
      configPath,
      "utf-8"
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsedConfig = JSON.parse(existingConfig) as Record<string, any>;

    const updatedConfig = {
      ...parsedConfig,
      ...config,
    } as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

    // if value not in config, remove it
    Object.keys(parsedConfig).forEach((key) => {
      if (!config?.[key as keyof typeof config]) {
        delete updatedConfig[key];
      }
    });

    await fsPromises.writeFile(
      configPath,
      JSON.stringify(updatedConfig, null, 2)
    );
  }
};
