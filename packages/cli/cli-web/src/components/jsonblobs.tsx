import { EyeIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

import { cliApi } from "../utils/api";

export const JsonBlobs = () => {
  const { data } = cliApi.getBlobs.useQuery();

  const { mutate } = cliApi.runFile.useMutation();

  const [expanded, setExpanded] = useState<number[]>([]);

  return (
    <div className="flex flex-col gap-2 pt-4">
      <div className="flex flex-row justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Your Webhooks
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {"(put json files in .captain/hooks)"}
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => alert("TODO: Open folder")}
        >
          Open .captain Folder
        </button>
      </div>

      <ul role="list" className="space-y-3">
        {data?.map((blob, i) => (
          <li
            key={blob.name}
            className="group flex flex-col items-start justify-between gap-2 overflow-hidden rounded-md bg-white px-6 py-4 shadow"
          >
            <div className="flex w-full flex-row items-center justify-between">
              <div className="text-xl">{blob.name}</div>
              <div className=" flex flex-row items-center gap-x-4 ">
                <button
                  className="invisible group-hover:visible"
                  onClick={() => {
                    setExpanded((prev) =>
                      prev.includes(i)
                        ? prev.filter((x) => x !== i)
                        : [...prev, i]
                    );
                  }}
                >
                  <EyeIcon className="h-4" />
                </button>
                <button
                  onClick={() => {
                    mutate({ file: blob.name, url: "http://localhost:2033" });
                  }}
                >
                  <PlayIcon className="h-4" />
                </button>
              </div>
            </div>
            {expanded.includes(i) && (
              <pre className="w-full rounded-md bg-gray-200 p-4">
                <code>{JSON.stringify(blob.content, null, 2)}</code>
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
