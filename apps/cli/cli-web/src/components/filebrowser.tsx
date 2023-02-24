import {
  FolderIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import toast from "react-hot-toast";

import { cliApi } from "../utils/api";
import { classNames } from "../utils/classnames";
import { Tooltip } from "./common/tooltip";

export const FileBrowser = () => {
  const [path, setPath] = useState<string[]>([]);

  const { data, isLoading } = cliApi.getFilesAndFolders.useQuery({
    path,
  });

  const { mutate: openFolder } = cliApi.openFolder.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (isLoading) {
    return <div>{`Loading...`}</div>;
  }

  return (
    <div className="flex flex-col gap-2 divide-y divide-gray-200">
      <nav className="flex justify-between" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div>
              <button
                onClick={() => setPath([])}
                className={classNames(
                  "text-gray-400",
                  path.length > 0 ? "hover:text-gray-500" : "cursor-default"
                )}
                disabled={path.length === 0}
              >
                <HomeIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only">{`root`}</span>
              </button>
            </div>
          </li>
          {path.map((page) => (
            <li key={page}>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <button
                  onClick={() =>
                    setPath((p) => {
                      return p.slice(0, p.indexOf(page) + 1);
                    })
                  }
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  aria-current={page ? "page" : undefined}
                >
                  {page}
                </button>
              </div>
            </li>
          ))}
        </ol>
        <button
          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => openFolder({ path: path.join("/") })}
        >
          {`Open Folder`}
        </button>
      </nav>
      <div className="py-2">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {`Folders`}
        </h3>
        <div className="flex flex-row space-x-3 overflow-x-auto py-2">
          {data?.folders.map((folder) => (
            <Tooltip key={folder} content={folder} placement="bottom">
              <button onClick={() => setPath((p) => [...p, folder])}>
                <div
                  key={folder}
                  className="flex w-28 flex-col items-center justify-center space-y-1 truncate rounded-md bg-white px-6 py-4 text-sm font-medium text-gray-600 shadow-sm hover:text-indigo-600 hover:shadow-md"
                >
                  <FolderIcon
                    className="h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="w-full truncate">{folder}</span>
                </div>
              </button>
            </Tooltip>
          ))}
          <div className="flex flex-col items-center justify-center rounded-md bg-white text-gray-600 hover:text-indigo-600 ">
            <PlusCircleIcon
              className="h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div className="py-2">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {`Files`}
        </h3>
        {data?.files.map((file) => (
          <div key={file}>{file}</div>
        ))}
      </div>
    </div>
  );
};
