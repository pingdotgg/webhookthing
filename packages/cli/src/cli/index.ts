
import { Command } from "commander";
import { getVersion } from "../utils/getVersion";

export const runCli = async () => {
  const program = new Command().name("captain");

  // TODO: This doesn't return anything typesafe. Research other options?
  // Emulate from: https://github.com/Schniz/soundtype-commander
  program
    .description("A CLI for creating web applications with the t3 stack")
    .version(getVersion(), "-v, --version", "Display the version number")
};
