interface Logger {
  trace(message: string, ...optionalParams: any[]): void;
  debug(message: string, ...optionalParams: any[]): void;
  info(message: string, ...optionalParams: any[]): void;
  warn(message: string, ...optionalParams: any[]): void;
  error(message: string, ...optionalParams: any[]): void;
  [x: string]: any;
}

const levels = ["trace", "debug", "info", "warn", "error"] as const;
export type LogLevels = (typeof levels)[number];

const prefixColors = {
  trace: `\x1b[90m`, // gray
  debug: `\x1b[36m`, // cyan
  info: `\x1b[97m`, // white
  warn: `\x1b[33m`, // yellow
  error: `\x1b[31m`, // red
};
const colorReset = `\x1b[0m`;

class logger implements Logger {
  private subscriptions: {
    fn: (m: { message: string; level: LogLevels }) => void;
    level: LogLevels;
  }[];

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

  subscribe(
    fn: (m: { message: string; level: LogLevels }) => void,
    level?: LogLevels
  ) {
    if (!level) level = "info";
    this.subscriptions.push({ fn, level });
  }

  unsubscribe(fn: (m: { message: string; level: LogLevels }) => void) {
    this.subscriptions = this.subscriptions.filter(
      ({ fn: subFn }) => subFn !== fn
    );
  }

  private log(level: LogLevels, message: string, optionalParams: any[]) {
    console[level](
      `${prefixColors[level]}[${level.toUpperCase()}] ${message}${colorReset}`,
      ...optionalParams
    );

    this.subscriptions.forEach(({ fn, level: subLevel }) => {
      if (getLogLevels(subLevel).includes(level)) fn({ message, level });
    });
  }
}

// get all log levels above and including the given level
const getLogLevels = (level: LogLevels): LogLevels[] => {
  return levels.slice(levels.indexOf(level));
};

export default new logger();
