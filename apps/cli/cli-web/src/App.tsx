import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Toaster } from "react-hot-toast";

import { EndpointSetting } from "./components/endpointsetting";
import { useConnectionStateToasts } from "./utils/useConnectionStateToasts";
import { ResponseViewer } from "./components/response-viewer";
import { FileBrowser } from "./components/filebrowser";
import {
  ArchiveBoxIcon,
  BookOpenIcon,
  EllipsisVerticalIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { classNames } from "./utils/classnames";

const SubscriptionsHelper = () => {
  useConnectionStateToasts();

  return null;
};

export default function Example() {
  return (
    <>
      <Toaster />
      <SubscriptionsHelper />
      <div className="flex h-screen min-h-full flex-col">
        <div className="pattern pb-32">
          <Disclosure as="nav">
            {() => (
              <>
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                  <div className="border-b border-gray-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                      <div className="flex items-center">
                        <div className="flex flex-shrink-0 items-center text-gray-50">
                          <h1 className="ml-2 text-4xl font-bold">
                            <span className="tracking-tight">
                              {`webhook`}
                              <span className="text-indigo-500">{`thing`}</span>
                            </span>
                            <span className="text-lg">
                              {`...by `}
                              <a href="https://ping.gg">{`Ping`}</a>
                            </span>
                          </h1>
                        </div>
                      </div>
                      <div className="flex items-end justify-center px-2">
                        <NavMenu />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Disclosure>
        </div>

        <main className="-mt-32 h-[calc(100vh-5rem)]">
          <div className="mx-auto flex h-3/5 w-full max-w-6xl flex-col gap-2 px-4 pb-12 sm:px-6 md:h-full md:flex-row lg:px-8">
            <div className="flex w-full rounded-lg bg-white px-5 py-6 shadow sm:px-6 md:w-3/5">
              <div className="flex w-full flex-col gap-4 divide-y divide-gray-200 rounded-lg border-gray-200">
                <FileBrowser />
                <EndpointSetting />
              </div>
            </div>
            <div className="flex h-2/5 w-full rounded-lg bg-white px-5 py-6 shadow sm:px-6 md:h-full md:w-2/5">
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
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center rounded-sm  text-gray-50 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">{`Open options`}</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="https://discord.gg/4wD3CNdsf6"
                  className={classNames(
                    active ? "bg-gray-100 text-indigo-700" : "text-gray-700",
                    "flex flex-row items-center justify-start gap-2 px-4 py-2 text-sm"
                  )}
                >
                  <QuestionMarkCircleIcon className="h-4" aria-hidden="true" />
                  {`Support`}
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="https://github.com/pingdotgg/sample_hooks/issues/new"
                  className={classNames(
                    active ? "bg-gray-100 text-indigo-700" : "text-gray-700",
                    "flex flex-row items-center justify-start gap-2 px-4 py-2 text-sm"
                  )}
                >
                  <ArchiveBoxIcon className="h-4" aria-hidden="true" />
                  {`File an Issue`}
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="https://docs.webhookthing.com"
                  className={classNames(
                    active ? "bg-gray-100 text-indigo-700" : "text-gray-700",
                    "flex flex-row items-center justify-start gap-2 px-4 py-2 text-sm"
                  )}
                >
                  <BookOpenIcon className="h-4" aria-hidden="true" />
                  {`Documentation`}
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
