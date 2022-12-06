import chalk from "chalk";

export const logger = {
  error(...args: unknown[]) {
    console.log(chalk.red(...args));
  },
  warn(...args: unknown[]) {
    console.log(chalk.yellow(...args));
  },
  info(...args: unknown[]) {
    console.log(chalk.cyan(...args));
  },
  success(...args: unknown[]) {
    console.log(chalk.green(...args));
  },
};

// formatters
export const highlight = (text: string): string => {
  return chalk.bold.underline(text);
};
