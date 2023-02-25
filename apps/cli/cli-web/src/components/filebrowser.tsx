import {
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon,
  HomeIcon,
  InformationCircleIcon,
  PlayIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import Highlight, { defaultProps } from "prism-react-renderer";
import vsLight from "prism-react-renderer/themes/vsLight";
import { useState } from "react";
import toast from "react-hot-toast";

import { cliApi } from "../utils/api";
import { classNames } from "../utils/classnames";
import { Tooltip } from "./common/tooltip";
import { useCurrentUrl } from "../utils/useCurrentUrl";
import { generatePrefillFromConfig } from "../utils/configTransforms";
import { WebhookFormModal } from "./webhook-form";
import { FolderFormModal } from "./folder-form-modal";

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

  const { data: blobData } = cliApi.getBlobs.useQuery({
    path,
  });

  const { mutate: runFile } = cliApi.runFile.useMutation({
    onSuccess: () => {
      toast.success(`Got response from server! Check console for details.`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [expanded, setExpanded] = useState<number[]>([]);

  const [selectedHookName, setSelectedHook] = useState<string>("");
  const [storedEndpoint] = useCurrentUrl();

  const addHookModalState = useState(false);
  const addFolderModalState = useState(false);

  const selectedHook = blobData?.find((x) => x.name === selectedHookName);

  if (isLoading) {
    return <div>{`Loading...`}</div>;
  }

  return (
    <div className="flex min-h-0 flex-col divide-y divide-gray-200 first-line:w-full">
      {/* breadcrumbs */}
      <nav
        className="flex items-center justify-between pb-4"
        aria-label="Breadcrumb"
      >
        <ol role="list" className="flex items-center space-x-4">
          <li className="flex-items-center">
            <button
              onClick={() => setPath([])}
              className={classNames(
                "flex items-center text-gray-400",
                path.length > 0 ? "hover:text-indigo-600" : "cursor-default"
              )}
              disabled={path.length === 0}
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">{`root`}</span>
            </button>
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
                  className="ml-4 text-sm font-medium text-gray-400 hover:text-indigo-600"
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
      {/* folders section */}
      <div className="py-2">
        <FolderFormModal
          openState={addFolderModalState}
          type="create"
          path={path}
        />
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {`Folders`}
        </h3>
        <div className="flex flex-row space-x-3 overflow-x-auto py-2">
          {data?.folders.map((folder) => (
            <Tooltip key={folder} content={folder} placement="bottom">
              <button onClick={() => setPath((p) => [...p, folder])}>
                <div
                  key={folder}
                  className="flex w-28 flex-col items-center justify-center space-y-1 truncate rounded-md border border-gray-50 px-6 py-4 text-sm font-medium text-gray-600 shadow-sm hover:bg-indigo-100/10 hover:text-indigo-600 hover:shadow-md"
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
          <div className="flex flex-col items-center justify-center rounded-md bg-white py-4 text-gray-600 hover:text-indigo-600">
            <button
              className="flex h-full w-full items-center justify-center"
              onClick={() => addFolderModalState[1](true)}
            >
              <PlusCircleIcon
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
      {/* files section */}
      <div className="flex min-h-0 grow flex-col py-2">
        <WebhookFormModal
          type="create"
          openState={addHookModalState}
          path={path}
        />
        {selectedHook && (
          <WebhookFormModal
            type="update"
            openState={[
              true,
              () => {
                setSelectedHook("");
              },
            ]}
            prefill={{
              ...selectedHook,
              config: generatePrefillFromConfig(selectedHook.config ?? {}),
            }}
            onClose={() => {
              setSelectedHook("");
            }}
            path={path}
          />
        )}
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {`Files`}
        </h3>
        <div className="w-full overflow-y-auto">
          <ul role="list" className="flex flex-col space-y-3 py-2">
            {blobData?.map((blob, i) => (
              <li
                key={blob.name}
                className="group flex flex-col items-start justify-between gap-2 overflow-hidden rounded-md border border-gray-50 px-6 py-4 shadow-sm hover:bg-indigo-100/10 hover:shadow-md"
              >
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-1 text-xl ">
                    {blob.name}
                    {(blob.config?.url || blob.config?.headers) && (
                      <Tooltip content="This has a custom config">
                        <InformationCircleIcon className="h-5 w-5 text-gray-800" />
                      </Tooltip>
                    )}
                  </div>
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
                      {expanded.includes(i) ? (
                        <EyeSlashIcon className="h-4" />
                      ) : (
                        <EyeIcon className="h-4 hover:text-indigo-600" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        runFile({
                          file: `${path.join("/")}/${blob.name}`,
                          url: storedEndpoint,
                        });
                      }}
                    >
                      <PlayIcon className="h-4 hover:text-indigo-600" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedHook(blob.name);
                      }}
                    >
                      <CogIcon className="h-4 hover:text-indigo-600" />
                    </button>
                  </div>
                </div>
                {expanded.includes(i) && (
                  <div className="flex w-full flex-col gap-2">
                    {blob.config?.url && (
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-gray-500">{`URL:`}</span>
                        <span className="text-gray-800">{blob.config.url}</span>
                      </div>
                    )}
                    {blob.config?.headers && (
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-gray-500">{`Headers:`}</span>
                        <span className="text-gray-800">
                          {JSON.stringify(blob.config.headers)}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-500">{`Body:`}</span>
                    <Highlight
                      {...defaultProps}
                      code={blob.body}
                      language="json"
                      theme={vsLight}
                    >
                      {({
                        className,
                        style,
                        tokens,
                        getLineProps,
                        getTokenProps,
                      }) => (
                        <pre
                          className={classNames(
                            className,
                            "w-full overflow-auto rounded-md !bg-gray-200 p-4"
                          )}
                          style={style}
                        >
                          {tokens.map((line, i) => (
                            <div {...getLineProps({ line, key: i })}>
                              {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  </div>
                )}
              </li>
            ))}
            <li className="flex flex-col items-center justify-center gap-2 overflow-hidden rounded-md px-6 py-4 text-gray-600 hover:text-indigo-600">
              <button
                className="flex h-full w-full items-center justify-center"
                onClick={() => addHookModalState[1](true)}
              >
                <PlusCircleIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
