interface Logger {
  trace(message: string, ...optionalParams: any[]): void;
  debug(message: string, ...optionalParams: any[]): void;
  info(message: string, ...optionalParams: any[]): void;
  warn(message: string, ...optionalParams: any[]): void;
  error(message: string, ...optionalParams: any[]): void;
  [x: string]: any;
}

export type LogLevels = "trace" | "debug" | "info" | "warn" | "error";

const prefixColors = {
  trace: `\x1b[90m`, // gray
  debug: `\x1b[36m`, // cyan
  info: `\x1b[97m`, // white
  warn: `\x1b[33m`, // yellow
  error: `\x1b[31m`, // red
};
const colorReset = `\x1b[0m`;

class logger implements Logger {
  private subscriptions: ((m: { message: string; level: LogLevels }) => void)[];

  constructor() {
    this.subscriptions = [];
  }

  trace(message: string, ...optionalParams: any[]) {
    this.log("trace", message, optionalParams);
  }

  debug(message?: any, ...optionalParams: any[]) {
    this.log("debug", message, optionalParams);
  }

  info(message?: any, ...optionalParams: any[]) {
    this.log("info", message, optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]) {
    this.log("warn", message, optionalParams);
  }

  error(message?: any, ...optionalParams: any[]) {
    this.log("error", message, optionalParams);
  }

  subscribe(fn: (m: { message: string; level: LogLevels }) => void) {
    this.subscriptions.push(fn);
  }

  unsubscribe(fn: (m: { message: string; level: LogLevels }) => void) {
    this.subscriptions = this.subscriptions.filter((sub) => sub !== fn);
  }

  private log(level: LogLevels, message: string, optionalParams: any[]) {
    console[level](
      `${prefixColors[level]}[${level}] ${message}${colorReset}`,
      ...optionalParams
    );

    this.subscriptions.forEach((sub) => sub({ message, level }));
  }
}

export default new logger();
