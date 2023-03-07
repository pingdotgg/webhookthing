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

export const Nav = (input: {
  path: string;
  actions?: ActionItems;
  arbitraryStuffImTooTiredToMakeNice?: React.ReactNode;
}) => {
  const { path, actions, arbitraryStuffImTooTiredToMakeNice } = input;

  const pathArr = path.split("/").slice(1);

  return (
    <nav
      className="flex items-center justify-between pb-4"
      aria-label="Breadcrumb"
    >
      <Breadcrumbs path={path} pathArr={pathArr} />
      {actions && (
        <Actions items={actions} stuff={arbitraryStuffImTooTiredToMakeNice} />
      )}
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

type ActionsItemCommon = {
  label: string | JSX.Element;
};

type ActionsItemButton = ActionsItemCommon & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

type ActionsItemLink = ActionsItemCommon & {
  href?: string;
};

type ActionsItem = ActionsItemLink | ActionsItemButton;

// TODO: some better way to have icons here, ping code had `dropdownItemWithIcon`
export type ActionItems = ActionsItem[];

const Actions = (input: { items: ActionItems; stuff: React.ReactNode }) => {
  return (
    <div className="flex flex-row gap-1">
      {input.items.map((item, i) => {
        if (item?.href)
          return (
            <Link
              className="flex items-center justify-center rounded-md border border-transparent border-gray-50 px-2 py-1 text-sm font-medium leading-4 text-gray-600 shadow-sm hover:bg-indigo-100/10 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              key={`${i}-breadcrumb}`}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        if (item?.onClick)
          return (
            <button
              className="flex items-center justify-center rounded-md border border-transparent border-gray-50 px-2 py-1 text-sm font-medium leading-4 text-gray-600 shadow-sm hover:bg-indigo-100/10 hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              key={`${i}-breadcrumb}`}
              onClick={item.onClick}
              disabled={item.disabled}
            >
              {item.label}
            </button>
          );
      })}
      {input.stuff}
    </div>
  );
};
