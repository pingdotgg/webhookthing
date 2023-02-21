import { LogLevels } from "@captain/logger";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

import { cliApi } from "../utils/api";
import { classNames } from "../utils/classnames";

const colorMap = {
  trace: "text-gray-600", // gray
  debug: `text-cyan-600`, // cyan
  info: `text-white`, // white
  warn: `text-yellow-600`, // yellow
  error: `text-red-600`, // red
} as const;

export const ResponseViewer = () => {
  const [messages, setMessages] = useState<
    { level: LogLevels; message: string }[]
  >([]);

  cliApi.onLog.useSubscription(undefined, {
    onData: (data) => {
      setMessages((messages) => {
        return [...messages, data];
      });
    },
  });

  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex max-h-96 flex-col gap-2 pt-4">
      <div className="flex flex-row items-center justify-between gap-2">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{`Log`}</h3>
        {
          <button
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
            onClick={() => setExpanded((v) => !v)}
          >
            <ChevronUpIcon
              className={classNames(
                "h-6 transition duration-500 ease-in-out hover:text-indigo-600",
                expanded ? "" : "rotate-180"
              )}
            />
          </button>
        }
      </div>
      {expanded && (
        <div className="h-48 w-full overflow-auto rounded-md !bg-gray-900 p-4">
          <table>
            {messages.map((message, index) => (
              <tr key={index}>
                <td
                  className={classNames(
                    "w-1/8 px-1 text-right align-top font-mono text-sm font-medium",
                    colorMap[message.level]
                  )}
                >
                  {`[${message.level.toUpperCase()}]`}
                </td>
                <td className="w-7/8 px-1 font-mono text-sm font-medium text-gray-300">
                  {message.message}
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
};
