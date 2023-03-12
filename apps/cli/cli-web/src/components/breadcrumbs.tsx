import { FolderIcon, HomeIcon } from "@heroicons/react/20/solid";
import { Link } from "wouter";
import { Tooltip } from "./common/tooltip";
import Button, {
  ButtonDropdown,
  ButtonLink,
  ButtonProps,
  SplitButtonDropdownTheSequel,
  type ListItemWithIcon,
} from "./common/button";

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
  label: string;
};

type ActionsItemButton = ActionsItemCommon &
  ButtonProps & {
    type: "button";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

type ActionsItemSplitButton = ActionsItemCommon &
  ButtonProps & {
    type: "splitButton";
    items: ListItemWithIcon[];
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

type ActionsItemDropdownButton = ActionsItemCommon &
  ButtonProps & {
    type: "dropdownButton";
    items: ListItemWithIcon[];
  };

type ActionsItemLink = ActionsItemCommon &
  ButtonProps & {
    type: "link";
    href?: string;
  };

type ActionsItem =
  | ActionsItemLink
  | ActionsItemButton
  | ActionsItemSplitButton
  | ActionsItemDropdownButton;

// TODO: some better way to have icons here, ping code had `dropdownItemWithIcon`
export type ActionItems = ActionsItem[];

const Actions = (input: { items: ActionItems; stuff: React.ReactNode }) => {
  return (
    <div className="flex flex-row gap-1">
      {input.items.map((item, i) => {
        if (item.type === "link")
          return (
            <ButtonLink key={`${i}-breadcrumb}`} {...item}>
              {item.label}
            </ButtonLink>
          );
        if (item.type === "button")
          return (
            <Button key={`${i}-breadcrumb}`} {...item}>
              {item.label}
            </Button>
          );
        if (item.type === "splitButton")
          return (
            <SplitButtonDropdownTheSequel
              // TODO igor:  TS is mad because the onClick doesn't have the same type
              {...item}
            />
          );
        if (item.type === "dropdownButton") return <ButtonDropdown {...item} />;
      })}
      {input.stuff}
    </div>
  );
};
