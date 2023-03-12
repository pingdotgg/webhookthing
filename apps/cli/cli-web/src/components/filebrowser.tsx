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
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "wouter";
import { Menu, Transition } from "@headlessui/react";
import { CliApiRouter } from "@captain/cli-core";
import { inferRouterOutputs } from "@trpc/server";

import { Nav } from "./breadcrumbs";
import { Tooltip } from "./common/tooltip";
import { FolderFormModal } from "./folder-form-modal";

import { cliApi } from "../utils/api";
import { classNames } from "../utils/classnames";
import { useFileRoute } from "../utils/useRoute";
import { FileFormModal } from "./file-form-modal";
import Button from "./common/button";

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
    <div className="flex min-h-0 flex-col divide-y divide-gray-200 first-line:w-full">
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
            label: (
              <>
                <span className="sr-only">{`Open create menu`}</span>
              </>
            ),
            icon: (
              <PlusIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            ),
            iconPosition: "end",
            items: [
              {
                name: "New Folder",
                action: () => addFolderModalState[1](true),
                icon: <FolderPlusIcon />,
              },
              {
                name: "New Hook",
                action: () => addHookModalState[1](true),
                icon: <DocumentPlusIcon />,
              },
            ],
          },
        ]}
        arbitraryStuffImTooTiredToMakeNice={
          <>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button
                  as={Button}
                  className="flex items-center justify-center rounded-md border border-transparent border-gray-50 px-2 py-1 text-sm font-medium leading-4 text-gray-600 shadow-sm hover:bg-indigo-100/10 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">{`Open create menu`}</span>
                  <PlusIcon
                    className="h-4 w-4 flex-shrink-0"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              {/* TODO: Igor, check Marks button  <button
            className="flex items-center justify-center rounded-md bg-white px-2 py-1 text-sm font-medium leading-4 text-gray-600 shadow-sm  hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => openFolder({ path })}
          >
            {`Open Folder`}
          </button> */}

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="w-full py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <div className="flex w-full flex-row items-center justify-start">
                          <button
                            className={classNames(
                              active
                                ? "bg-gray-200 text-indigo-700"
                                : "text-gray-700",
                              "flex w-full flex-row items-center justify-start gap-2 px-4 py-2 text-sm"
                            )}
                            onClick={() => {
                              addFolderModalState[1](true);
                            }}
                          >
                            <FolderPlusIcon
                              className="h-4"
                              aria-hidden="true"
                            />
                            {`New Folder`}
                          </button>
                        </div>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <div className="flex flex-row items-center justify-start">
                          <button
                            className={classNames(
                              active
                                ? "bg-gray-200 text-indigo-700"
                                : "text-gray-700",
                              "flex w-full flex-row items-center justify-start gap-2 px-4 py-2 text-sm"
                            )}
                            onClick={() => {
                              addHookModalState[1](true);
                            }}
                          >
                            <DocumentPlusIcon
                              className="h-4"
                              aria-hidden="true"
                            />
                            {`New Hook`}
                          </button>
                        </div>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </>
        }
      />
      <FolderFormModal openState={addFolderModalState} path={pathArr} />
      <FileFormModal openState={addHookModalState} path={pathArr} />
      {/* folders section */}
      <div className="py-2">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {`Folders`}
        </h3>
        <div className="flex h-28 flex-row space-x-3 overflow-x-auto px-1 py-2">
          {data.folders.map((folder) => (
            <div key={folder} className="w-1/5 min-w-[8rem]">
              <Tooltip content={folder} placement="bottom">
                <Link href={pathArrToUrl(pathArr, folder)}>
                  <button className="flex w-full flex-col items-center justify-center space-y-1 truncate rounded-md bg-white px-6 py-4 text-sm font-medium text-gray-600 shadow-sm  hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <FolderIcon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="w-full truncate text-center">
                      {folder}
                    </span>
                  </button>
                </Link>
              </Tooltip>
            </div>
          ))}
          <div className="w-1/5 min-w-[8rem]">
            <button
              className="flex w-full flex-col items-center justify-center space-y-1 truncate rounded-md bg-white px-6 py-4 text-sm font-medium text-gray-600 shadow-sm  hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => addFolderModalState[1](true)}
            >
              <FolderPlusOutline
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="w-full truncate text-center">
                {`New Folder`}
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* files section */}
      <div className="flex min-h-0 grow flex-col py-2">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {`Files`}
        </h3>
        <div className="w-full overflow-y-auto px-1">
          {data.files.length === 0 ? (
            <div className="text-center">
              <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                {`No hook files found!`}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {`Get started by `}
                <button
                  className="text-indigo-600 hover:underline"
                  onClick={() => addHookModalState[1](true)}
                >{`creating a new hook file`}</button>
                {location === "/" ? (
                  <>
                    {`, or download some sample hooks with the button below.`}
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => downloadSampleHooks()}
                      >
                        <CloudArrowDownIcon
                          className="-ml-1 mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        {`Download Sample Hooks`}
                      </button>
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
                    <button className="group flex grow flex-row items-start justify-between gap-2 overflow-hidden rounded-md bg-white px-6 py-2 font-medium text-gray-600 shadow-sm   hover:text-indigo-600  hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
                    </button>
                  </Link>
                  <button
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-3 text-sm font-medium leading-4 text-gray-600 shadow-sm hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                    disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:shadow-sm"
                    onClick={() => {
                      runFile({
                        file: `${path}/${file.name}`,
                      });
                    }}
                    disabled={!file.config?.url}
                  >
                    <PlayIcon className="h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
