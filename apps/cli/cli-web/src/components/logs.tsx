import { ReactNode, useState } from "react";
import { cliApi } from "../utils/api";

import type { LogLevels } from "@captain/logger";

const colorMap = {
  trace: "text-gray-600", // gray
  debug: `text-cyan-600`, // cyan
  info: `text-white`, // white
  warn: `text-yellow-600`, // yellow
  error: `text-red-600`, // red
} as const;

const webFormat = (input: { level: LogLevels; message: string }) => {
  const { level, message } = input;
  return (
    <span className={colorMap[level]}>
      <span className="font-semibold">[{level.toUpperCase()}]</span> {message}
    </span>
  );
};

export const Logs = () => {
  const [messages, setMessages] = useState<ReactNode[]>([]);
  cliApi.onLog.useSubscription(undefined, {
    onData: (data) => {
      setMessages((messages) => {
        return [...messages, webFormat(data)];
      });
    },
  });

  return (
    <div className="flex h-96 flex-col overflow-y-auto rounded-md bg-gray-900 p-4">
      {...messages}
    </div>
  );
};
