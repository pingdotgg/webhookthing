import { HomeIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

import { cliApi } from "../utils/api";
import { classNames } from "../utils/classnames";

export const FileBrowser = () => {
  const [path, setPath] = useState<string[]>([]);

  const { data, isLoading } = cliApi.getFilesAndFolders.useQuery({
    path,
  });

  if (isLoading) {
    return <div>{`Loading...`}</div>;
  }

  return (
    <div className="flex flex-col gap-2 divide-y divide-gray-400">
      <nav className="flex" aria-label="Breadcrumb">
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
      </nav>
      <div>
        {`Folders:`}
        {data?.folders.map((folder) => (
          <div key={folder}>
            <button onClick={() => setPath((p) => [...p, folder])}>
              {folder}
            </button>
          </div>
        ))}
      </div>
      {`Files:`}
      {data?.files.map((file) => (
        <div key={file}>{file}</div>
      ))}
    </div>
  );
};
