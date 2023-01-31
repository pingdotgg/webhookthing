import { execSync } from "child_process";
import type { PackageJson } from "type-fest";
import path from "path";
import fs from "fs-extra";

const PKG_ROOT = path.join(__dirname, "..");

export const getVersion = () => {
  const packageJsonPath = path.join(PKG_ROOT, "package.json");

  const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson;

  return packageJsonContent.version ?? "1.0.0";
};

const NPM_URL = "https://registry.npmjs.org/-/package/webhookthing/dist-tags";

export const renderVersionWarning = (npmVersion: string) => {
  const currentVersion = getVersion();

  if (currentVersion.includes("beta")) {
    console.log(
      "\x1b[33m[WARNING] You are using a beta version of webhookthing."
    );
    console.log("\x1b[33m[WARNING] Please report any bugs you encounter.");
  } else if (currentVersion.includes("next")) {
    console.log(
      "\x1b[33m[WARNING] You are running webhookthing with the @next tag which is no longer maintained."
    );
    console.log("\x1b[33m[WARNING] Please run the CLI with @latest instead.");
  } else if (currentVersion !== npmVersion) {
    console.log(
      "\x1b[33m[WARNING] You are using an outdated version of webhookthing."
    );
    console.log(
      "\x1b[33m[WARNING] Your version:",
      currentVersion + ".",
      "Latest version in the npm registry:",
      npmVersion
    );
    console.log(
      "\x1b[33m[WARNING] Please run the CLI with @latest to get the latest updates."
    );
  }
  console.log("");
};

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * https://github.com/facebook/create-react-app/blob/main/packages/create-react-app/LICENSE
 */
import https from "https";

type DistTagsBody = {
  latest: string;
};

function checkForLatestVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(NPM_URL, (res) => {
        if (res.statusCode === 200) {
          let body = "";
          res.on("data", (data) => (body += data));
          res.on("end", () => {
            resolve((JSON.parse(body) as DistTagsBody).latest);
          });
        } else {
          reject();
        }
      })
      .on("error", () => {
        console.log("\x1b[31m[ERROR] Unable to check for latest version.");
        reject();
      });
  });
}

export const getNpmVersion = () =>
  // `fetch` to the registry is faster than `npm view` so we try that first
  checkForLatestVersion().catch(() => {
    try {
      return execSync("npm view webhookthing version").toString().trim();
    } catch {
      return null;
    }
  });
