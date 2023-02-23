import { LogLevels } from "@captain/logger";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";

import { cliApi } from "../utils/api";
import { classNames } from "../utils/classnames";
import { Tooltip } from "./common/tooltip";

const colorMap = {
  trace: { label: "text-gray-600", body: "text-gray-700" }, // gray
  debug: { label: "text-cyan-600", body: "text-cyan-700" }, // cyan
  info: { label: "text-white", body: "text-gray-100" }, // white
  warn: { label: "text-yellow-600", body: "text-yellow-700" }, // yellow
  error: { label: "text-red-600", body: "text-red-700" }, // red
} as const;

export const ResponseViewer = () => {
  const [messages, setMessages] = useState<
    { level: LogLevels; message: string; ts: number }[]
  >([]);

  cliApi.onLog.useSubscription(undefined, {
    onData: (data) => {
      setMessages((messages) => {
        return [...messages, data];
      });
    },
  });

  const [expanded, setExpanded] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                <Tooltip
                  content={new Date(message.ts).toLocaleString()}
                  placement="top"
                >
                  <td
                    className={classNames(
                      "min-w-[70px] px-1 text-right align-top font-mono text-sm font-semibold",
                      colorMap[message.level].label
                    )}
                  >
                    {`[${message.level.toUpperCase()}]`}
                  </td>
                </Tooltip>
                <td
                  className={classNames(
                    "px-1 font-mono text-sm font-medium text-gray-300",
                    colorMap[message.level].body
                  )}
                >
                  {message.message}
                </td>
              </tr>
            ))}
          </table>
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
