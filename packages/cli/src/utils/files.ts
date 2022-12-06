import fs from "fs";
import path from "path";

import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import XDGAppPaths from "xdg-app-paths";

import { highlight, logger } from "./logger";

const fileNameSymbol = Symbol("fileName");

// Error Type Stuff --------------------------------------------

export const isObject = (obj: unknown): obj is Record<string, unknown> =>
  typeof obj === "object" && obj !== null;

export const isError = (error: unknown): error is Error => {
  if (!isObject(error)) return false;

  if (error instanceof Error) return true;

  while (error) {
    if (Object.prototype.toString.call(error) === "[object Error]") return true;
    error = Object.getPrototypeOf(error);
  }

  return false;
};

export const isErrnoException = (
  error: unknown
): error is NodeJS.ErrnoException => {
  return isError(error) && "code" in error;
};

// File System Stuff --------------------------------------------

// Returns whether a directory exists
export const isDirectory = (path: string): boolean => {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch (_) {
    // We don't care which kind of error occured, it isn't a directory anyway.
    return false;
  }
};

const getConfigPath = (): string => {
  const xdgAppPaths = XDGAppPaths("com.captain.cli");
  const configDir = xdgAppPaths.config();

  // create directory if it doesn't exist
  if (!isDirectory(configDir)) {
    logger.info(`Creating config directory at ${highlight(configDir)}`);
    fs.mkdirSync(configDir, { recursive: true });
  }

  return configDir;
};

const AUTH_CONFIG_FILE_PATH = path.join(getConfigPath(), "auth.json");

// Config File Read/Write Stuff ---------------------------------

interface AuthConfig {
  token?: string;
}
export const isAuthConfig = (obj: unknown): obj is AuthConfig => {
  return typeof obj === "object" && obj !== null && "token" in obj;
};

export const readAuthConfigFile = (): AuthConfig => {
  const config = loadJsonFileSync(AUTH_CONFIG_FILE_PATH);

  if (!isAuthConfig(config)) {
    throw new Error(
      `The file ${highlight(
        AUTH_CONFIG_FILE_PATH
      )} is not a valid auth config file`
    );
  }

  return config;
};

export const writeToAuthConfigFile = (authConfig: AuthConfig) => {
  try {
    return writeJsonFileSync(AUTH_CONFIG_FILE_PATH, authConfig, {
      indent: 2,
      mode: 0o600,
    });
  } catch (err: unknown) {
    if (isErrnoException(err)) {
      if (err.code === "EPERM") {
        logger.error(
          `Not able to create ${highlight(
            AUTH_CONFIG_FILE_PATH
          )} (operation not permitted).`
        );
        process.exit(1);
      } else if (err.code === "EBADF") {
        logger.error(
          `Not able to create ${highlight(
            AUTH_CONFIG_FILE_PATH
          )} (bad file descriptor).`
        );
        process.exit(1);
      }
    }

    throw err;
  }
};
