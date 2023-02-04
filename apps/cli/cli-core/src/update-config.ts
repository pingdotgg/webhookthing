import { z } from "zod";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import { HOOK_PATH } from "./constants";

export const configValidator = z.object({
  url: z.string(),
  query: z.record(z.string()).optional(),
  headers: z.record(z.string()).optional(),
});

export type ConfigValidatorType = z.infer<typeof configValidator>;

export const updateConfig = async ({
  name,
  config,
}: {
  name: string;
  config?: ConfigValidatorType;
}) => {
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

  // Create config file if it doesn't exist
  if (!fs.existsSync(path.join(HOOK_PATH, `${name}.config.json`))) {
    await fsPromises.writeFile(
      path.join(HOOK_PATH, `${name}.config.json`),
      JSON.stringify(config, null, 2)
    );
  } else {
    // Otherwise, update existing config file
    const existingConfig = await fsPromises.readFile(
      path.join(HOOK_PATH, `${name}.config.json`),
      "utf-8"
    );

    const parsedConfig = JSON.parse(existingConfig);

    const updatedConfig = {
      ...parsedConfig,
      ...config,
    };

    // if value not in config, remove it
    Object.keys(parsedConfig).forEach((key) => {
      if (!config?.[key as keyof typeof config]) {
        delete updatedConfig[key];
      }
    });

    await fsPromises.writeFile(
      path.join(HOOK_PATH, `${name}.config.json`),
      JSON.stringify(updatedConfig, null, 2)
    );
  }
};
