import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Toaster } from "react-hot-toast";
import { Link } from "wouter";
import {
  ArchiveBoxIcon,
  ArrowPathIcon,
  BookOpenIcon,
  EllipsisVerticalIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";

import { useConnectionStateToasts } from "./utils/useConnectionStateToasts";
import { ResponseViewer } from "./components/response-viewer";
import { FileBrowser } from "./components/filebrowser";
import { classNames } from "./utils/classnames";
import { useFileRoute } from "./utils/useRoute";
import { FileRunner } from "./components/filerunner";
import { cliApi } from "./utils/api";
import { ButtonDropdown } from "./components/common/button";

const SubscriptionsHelper = () => {
  useConnectionStateToasts();

  return null;
};

const PageContent = () => {
  const location = useFileRoute();

  const { data, isLoading } = cliApi.parseUrl.useQuery({ url: location });

  if (isLoading || !data)
    return (
      <div className="flex h-full flex-row items-center justify-center text-gray-500">
        <ArrowPathIcon className="h-20 animate-spin" aria-hidden="true" />
      </div>
    );

  if (data.type === "file")
    return <FileRunner path={data.path} data={data.data} />;
  if (data.type === "folder")
    return <FileBrowser path={data.path} data={data.data} />;
  if (data.type === "notFound")
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="text-base font-semibold text-indigo-600">{`404`}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{`File not found`}</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">{`It looks like you haven't created this file yet.
        `}</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md border border-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {`Go back home`}
          </Link>
        </div>
      </div>
    );

  throw new Error("unreachable");
};

export default function AppCore() {
  return (
    <>
      <Toaster />
      <SubscriptionsHelper />
      <div className="flex h-screen min-h-full flex-col">
        <div className="pattern pb-32 shadow-xl">
          <Disclosure as="nav">
            {() => (
              <>
                <div className="mx-auto max-w-6xl">
                  <div className="flex h-16 items-center justify-between px-4 ">
                    <div className="flex items-center">
                      <div className="flex flex-shrink-0 items-center text-gray-50">
                        <h1 className="ml-2 text-4xl font-bold">
                          <Link href="/">
                            <span className="tracking-tight hover:cursor-pointer">
                              {`webhook`}
                              <span className="text-indigo-500">{`thing`}</span>
                            </span>
                          </Link>
                          <span className="text-lg">
                            {`...by `}
                            <a
                              href="https://ping.gg"
                              className="hover:text-[#DB1D70]"
                            >{`Ping`}</a>
                          </span>
                        </h1>
                      </div>
                    </div>
                    <div className="flex items-end justify-center px-2">
                      <NavMenu />
                    </div>
                  </div>
                </div>
              </>
            )}
          </Disclosure>
        </div>

        <main className="-mt-32 h-[calc(100vh-5rem)]">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-2 px-2 lg:h-full lg:flex-row">
            <div className="flex h-3/5 w-full flex-col divide-y divide-gray-200 overflow-y-auto rounded-lg bg-gray-100 p-4 shadow lg:h-full lg:w-3/5 ">
              {/* File browser / Hook Editor / 404 */}
              <PageContent />
            </div>
            <div className="flex h-2/5 w-full rounded-lg bg-gray-100 p-4 shadow lg:h-full lg:w-2/5">
              {/* Logs */}
              <ResponseViewer />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

const NavMenu = () => {
  return (
    <ButtonDropdown
      label={<span className="sr-only">{`Open options`}</span>}
      variant="text"
      icon={<EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />}
      items={[
        {
          name: "Support",
          href: "https://discord.gg/4wD3CNdsf6",
          icon: <QuestionMarkCircleIcon />,
          type: "link",
        },
        {
          name: "File an issue",
          href: "https://github.com/pingdotgg/sample_hooks/issues/new",
          icon: <ArchiveBoxIcon />,
          type: "link",
        },
        {
          name: "Documentation",
          href: "https://docs.webhookthing.com",
          icon: <BookOpenIcon className="h-5 w-5 flex-shrink-0" />,
          type: "link",
        },
      ]}
    />
  );
};
