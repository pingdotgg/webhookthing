import { LogLevels } from "@captain/logger";
import { useEffect, useRef, useState } from "react";

import { cliApi } from "../utils/api";
import { classNames } from "../utils/classnames";
import { Tooltip } from "./common/tooltip";

const colorMap = {
  trace: {
    label: "text-gray-500",
    body: "text-gray-500",
    bg: "bg-gray-700",
    bgHover: "hover:hover:bg-gray-600",
  }, // gray
  debug: {
    label: "text-cyan-500",
    body: "text-cyan-500",
    bg: "bg-cyan-800",
    bgHover: "hover:bg-cyan-700",
  }, // cyan
  info: {
    label: "text-white",
    body: "text-gray-50",
    bg: "bg-gray-700",
    bgHover: "hover:hover:bg-gray-600",
  }, // white
  warn: {
    label: "text-yellow-500",
    body: "text-yellow-500",
    bg: "bg-yellow-800",
    bgHover: "hover:bg-yellow-700",
  }, // yellow
  error: {
    label: "text-red-400",
    body: "text-red-400",
    bg: "bg-red-800",
    bgHover: "hover:bg-red-700",
  }, // red
} as const;

type Log = {
  level: LogLevels;
  message: string;
  ts: number;
};

export const ResponseViewer = () => {
  const [messages, setMessages] = useState<
    { level: LogLevels; message: string; ts: number }[]
  >([]);

  const [currentLog, setCurrentLog] = useState<
    { level: LogLevels; message: string; ts: number } | undefined
  >(undefined);
  const dirtySetCurrentLog = (log: Log) => {
    setIsDirty(true);
    setCurrentLog(log);
  };

  const [isDirty, setIsDirty] = useState(false);

  cliApi.onLog.useSubscription(undefined, {
    onData: (data) => {
      setMessages((messages) => {
        return [...messages, data];
      });
    },
  });

  const bottomRefHistory = useRef<HTMLDivElement>(null);
  const bottomRefOutput = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 👇️ scroll to bottom of history every time messages change
    bottomRefHistory.current?.scrollIntoView({ behavior: "smooth" });
    if (!isDirty) {
      setCurrentLog(messages[messages.length - 1]);
    }
  }, [messages, isDirty]);

  useEffect(() => {
    // 👇️ scroll to bottom of output every time current log changes
    bottomRefOutput.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentLog]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex h-60 max-h-fit w-full flex-col gap-2">
        <div className="flex flex-row items-center justify-between gap-2">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{`History`}</h3>
        </div>

        <div className="h-full w-full overflow-auto rounded-md !bg-gray-800 px-1 py-4 text-gray-200">
          <History logs={messages} setCurrentLog={dirtySetCurrentLog} />
          <div ref={bottomRefHistory} />
        </div>
      </div>

      <div className="flex max-h-fit w-full flex-grow flex-col gap-2">
        <div className="flex flex-row items-center justify-between gap-2">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{`Log`}</h3>
        </div>

        <div className="relative h-full w-full overflow-auto rounded-md !bg-gray-800 text-gray-200">
          <div
            className={classNames(
              "sticky top-0 bg-gray-900 py-1 px-1",
              colorMap[currentLog?.level || "info"].label,
              colorMap[currentLog?.level || "info"].bg
            )}
          >
            {`Function name`}{" "}
            {currentLog && new Date(currentLog?.ts).toUTCString()}
          </div>
          <HmmOutput currentLog={currentLog} />
          <div ref={bottomRefOutput} />
        </div>
      </div>
    </div>
  );
};

const PreviousOutput = ({ messages }: { messages: Log[] }) => {
  return (
    <table>
      <tbody>
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
      </tbody>
    </table>
  );
};

const HmmOutput = ({ currentLog }: { currentLog?: Log }) => {
  if (!currentLog) {
    return <div>{`No logs yet`}</div>;
  }

  return <Log currentLog={currentLog} />;
};

const Log = ({
  currentLog,
}: {
  currentLog: { level: LogLevels; message: string; ts: number };
}) => {
  return <div>{currentLog.message}</div>;
};

const History = ({
  logs,
  setCurrentLog,
}: {
  logs: Log[];
  setCurrentLog: (log: Log) => void;
}) => {
  return (
    <div>
      {logs.map((log) => (
        <>
          <button
            className={classNames(
              "w-full px-1 py-1 text-left font-mono text-sm font-semibold",
              colorMap[log.level].label,
              colorMap[log.level].bg,
              colorMap[log.level].bgHover
            )}
            onClick={() => {
              setCurrentLog(log);
            }}
          >
            {/* I Kinda want this to be relative time, then on a tooltip show the UTC or ISO time */}
            {new Date(log.ts).toUTCString()} {`function name`}
          </button>
        </>
      ))}
    </div>
  );
};
