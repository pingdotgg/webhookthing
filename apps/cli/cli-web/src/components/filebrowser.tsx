import {
  CloudArrowDownIcon,
  DocumentDuplicateIcon,
  DocumentPlusIcon,
  ExclamationCircleIcon,
  FolderIcon,
  FolderPlusIcon,
  InformationCircleIcon,
  PlayIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { FolderPlusIcon as FolderPlusOutline } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "wouter";
import { CliApiRouter } from "@captain/cli-core";
import { inferRouterOutputs } from "@trpc/server";

import { Nav } from "./breadcrumbs";
import { Tooltip } from "./common/tooltip";
import { FolderFormModal } from "./folder-form-modal";

import { cliApi } from "../utils/api";
import { useFileRoute } from "../utils/useRoute";
import { FileFormModal } from "./file-form-modal";
import { ButtonLink, Button } from "./common/button";
import { classNames } from "../utils/classnames";

const pathArrToUrl = (pathArr: string[], nav?: string) => {
  const url = nav ? `${pathArr.concat(nav).join("/")}` : `${pathArr.join("/")}`;

  // make sure we always have a leading slash
  if (!url.startsWith("/")) return `/${url}`;
  return url;
};

type DataResponse = inferRouterOutputs<CliApiRouter>["parseUrl"];
export type FolderDataType = Extract<DataResponse, { type: "folder" }>["data"];

export const FileBrowser = (input: { path: string; data: FolderDataType }) => {
  const { path, data } = input;
  const location = useFileRoute();

  const pathArr = path.split("/").slice(1);

  const { mutate: openFolder } = cliApi.openFolder.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: runFile } = cliApi.runFile.useMutation({
    onSuccess: () => {
      toast.success(`Got response from server! Check console for details.`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const ctx = cliApi.useContext();

  const { mutate: downloadSampleHooks } = cliApi.getSampleHooks.useMutation({
    onSuccess: async () => {
      await ctx.parseUrl.invalidate();
    },
  });

  const addHookModalState = useState(false);
  const addFolderModalState = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col first-line:w-full">
      {/* breadcrumbs */}
      <Nav
        path={path}
        actions={[
          {
            type: "button",
            label: "Open Folder",
            onClick: () => openFolder({ path }),
          },
          {
            type: "dropdownButton",
            label: "Open Create Menu",
            srlabel: true,
            icon: (
              <PlusIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            ),
            iconPosition: "end",
            items: [
              {
                name: "New Folder",
                type: "button",
                action: () => addFolderModalState[1](true),
                icon: <FolderPlusIcon />,
              },
              {
                name: "New Hook",
                type: "button",
                action: () => addHookModalState[1](true),
                icon: <DocumentPlusIcon />,
              },
            ],
          },
        ]}
      />
      <FolderFormModal openState={addFolderModalState} path={pathArr} />
      <FileFormModal openState={addHookModalState} path={pathArr} />
      {/* folders section */}
      <div className="mb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {`Folders`}
        </h3>
        <div className="flex flex-row space-x-3 overflow-x-auto rounded-lg bg-gray-200/50 p-2 shadow-inner">
          {data.folders.map((folder) => (
            <div key={folder} className="w-1/5 min-w-[8rem]">
              <Tooltip content={folder} placement="bottom" className="-mt-16">
                <Link href={pathArrToUrl(pathArr, folder)}>
                  <ButtonLink className="flex h-full w-full flex-col items-center justify-center space-y-1 truncate px-6 py-4">
                    <FolderIcon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="block w-full truncate text-center">
                      {folder}
                    </span>
                  </ButtonLink>
                </Link>
              </Tooltip>
            </div>
          ))}
          <div className="w-1/5 min-w-[8rem]">
            <Button
              className="flex h-full w-full flex-col items-center justify-center space-y-1 truncate px-6 py-4 "
              onClick={() => addFolderModalState[1](true)}
            >
              <FolderPlusOutline
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="w-full truncate text-center">
                {`New Folder`}
              </span>
            </Button>
          </div>
        </div>
      </div>
      {/* files section */}
      <div className="flex min-h-0 flex-1 flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {`Files`}
        </h3>
        <div
          className={classNames(
            "flex w-full flex-1 flex-col overflow-y-auto rounded-lg bg-gray-200/50 p-2 shadow-inner",
            data.files.length === 0 ? "justify-center" : ""
          )}
        >
          {data.files.length === 0 ? (
            <div className="text-center">
              <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                {`No hook files found!`}
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                {`Get started by `}
                <button
                  className="text-indigo-600 hover:underline"
                  onClick={() => addHookModalState[1](true)}
                >{`creating a new hook file`}</button>
                {location === "/" ? (
                  <>
                    {`, or download some sample hooks with the button below.`}
                    <div className="mt-6">
                      <Button
                        type="button"
                        variant="indigo"
                        size="lg"
                        icon={
                          <CloudArrowDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        }
                        onClick={() => downloadSampleHooks()}
                      >
                        {`Download Sample Hooks`}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>{`.`}</>
                )}
              </p>
            </div>
          ) : (
            <ul role="list" className="flex flex-col space-y-3 py-2">
              {data.files.map((file) => (
                <li key={file.name} className="flex w-full flex-row gap-2">
                  <Link href={pathArrToUrl(pathArr, file.name)}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="group flex grow flex-row items-start justify-between gap-2 overflow-hidden"
                    >
                      {file.name}
                      <div className="flex flex-row gap-2">
                        {!file.config?.url ? (
                          <Tooltip content="Missing URL" placement="left">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
                          </Tooltip>
                        ) : (
                          (file.config?.headers || file.config?.query) && (
                            <Tooltip
                              content="This hook has a custom config"
                              placement="left"
                            >
                              <InformationCircleIcon className="h-5 w-5 text-gray-600" />
                            </Tooltip>
                          )
                        )}
                      </div>
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex items-center justify-center"
                    onClick={() => {
                      runFile({
                        file: `${path}/${file.name}`,
                      });
                    }}
                    disabled={!file.config?.url}
                  >
                    <PlayIcon className="h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
