import { EyeIcon, PlayIcon } from "@heroicons/react/20/solid";

import { cliApi } from "../utils/api";

export const JsonBlobs = () => {
  const { data } = cliApi.getBlobs.useQuery();

  const { mutate } = cliApi.runFile.useMutation();

  //stacked list with a button to run the file, and a button to expand the row to show the contents

  return (
    <div className="flex flex-col gap-2 pt-4">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Your Webhooks
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {"(put json files in .captain/hooks)"}
        </p>
      </div>

      <ul role="list" className="space-y-3">
        {data?.map((blob) => (
          <li
            key={blob}
            className="group flex flex-row items-center justify-between overflow-hidden rounded-md bg-white px-6 py-4 shadow"
          >
            <div className="text-xl">{blob}</div>
            <div className=" flex flex-row items-center gap-x-4 ">
              <button
                className="invisible group-hover:visible"
                onClick={() => {
                  alert("hi!");
                }}
              >
                <EyeIcon className="h-4" />
              </button>
              <button
                onClick={() => {
                  mutate({ file: blob, url: "http://localhost:2033" });
                }}
              >
                <PlayIcon className="h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
