import { FolderIcon, HomeIcon } from "@heroicons/react/20/solid";
import { Link } from "wouter";
import { Tooltip } from "./common/tooltip";

import { classNames } from "../utils/classnames";

const pathArrToUrl = (pathArr: string[], nav?: string) => {
  const url = nav ? `${pathArr.concat(nav).join("/")}` : `${pathArr.join("/")}`;

  // make sure we always have a leading slash
  if (!url.startsWith("/")) return `/${url}`;
  return url;
};

export const Nav = (input: { path: string; actions?: React.ReactNode }) => {
  const { path } = input;

  const pathArr = path.split("/").slice(1);

  return (
    <nav
      className="flex items-center justify-between pb-4"
      aria-label="Breadcrumb"
    >
      <Breadcrumbs path={path} pathArr={pathArr} />
      {/* actions */}
      {/* <div className="flex flex-row gap-1">
        <button
          className="flex items-center justify-center rounded-md border border-transparent border-gray-50 px-2 py-1 text-sm font-medium leading-4 text-gray-600 shadow-sm hover:bg-indigo-100/10 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => openFolder({ path })}
        >
          {`Open Folder`}
        </button>

        <FolderFormModal openState={addFolderModalState} path={pathArr} />
        <FileFormModal openState={addHookModalState} path={pathArr} />
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex items-center justify-center rounded-md border border-transparent border-gray-50 px-2 py-1 text-sm font-medium leading-4 text-gray-600 shadow-sm hover:bg-indigo-100/10 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span className="sr-only">{`Open create menu`}</span>
              <PlusIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            </Menu.Button>
          </div>

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
                            ? "bg-gray-100 text-indigo-700"
                            : "text-gray-700",
                          "flex w-full flex-row items-center justify-start gap-2 px-4 py-2 text-sm"
                        )}
                        onClick={() => {
                          addFolderModalState[1](true);
                        }}
                      >
                        <FolderPlusIcon className="h-4" aria-hidden="true" />
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
                            ? "bg-gray-100 text-indigo-700"
                            : "text-gray-700",
                          "flex w-full flex-row items-center justify-start gap-2 px-4 py-2 text-sm"
                        )}
                        onClick={() => {
                          addHookModalState[1](true);
                        }}
                      >
                        <DocumentPlusIcon className="h-4" aria-hidden="true" />
                        {`New Hook`}
                      </button>
                    </div>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div> */}

      {input.actions}
    </nav>
  );
};

const Breadcrumbs = (input: { path: string; pathArr: string[] }) => {
  const { path, pathArr } = input;

  return (
    <ol role="list" className="flex items-center">
      <li className="flex-items-center">
        <Link
          href="/"
          className={classNames(
            "flex items-center text-gray-400",
            path.length > 1 ? "hover:text-indigo-600" : "cursor-default"
          )}
        >
          <HomeIcon className="h-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">{`root`}</span>
        </Link>
      </li>
      {path.length > 1 &&
        pathArr.map((page, i) => (
          <li key={page}>
            <div className="flex items-center">
              <svg
                className="h-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link
                href={pathArrToUrl(pathArr.slice(0, pathArr.indexOf(page) + 1))}
                className={classNames(
                  "text-sm font-medium text-gray-400 ",
                  i !== pathArr.length - 1
                    ? "hover:text-indigo-600"
                    : "cursor-default"
                )}
                aria-current={page ? "page" : undefined}
              >
                <Tooltip content={page}>
                  <FolderIcon
                    className={classNames(
                      "inline h-5",
                      i === pathArr.length - 1
                        ? "hidden"
                        : pathArr.join().length > 48
                        ? ""
                        : "sm:hidden"
                    )}
                    aria-hidden="true"
                  />
                </Tooltip>
                <p
                  className={classNames(
                    i === pathArr.length - 1
                      ? "inline truncate"
                      : pathArr.join().length > 48
                      ? "hidden"
                      : "hidden sm:inline"
                  )}
                >
                  {page}
                </p>
              </Link>
            </div>
          </li>
        ))}
    </ol>
  );
};
