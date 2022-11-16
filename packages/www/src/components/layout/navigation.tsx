import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { ForwardIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Avatar } from "../common/avatar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogoMark } from "../common/logo";

export default function TopNav() {
  const { data: session } = useSession();
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {() => (
        <>
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <>
                      <LogoMark className="block h-8 w-auto text-indigo-600 lg:hidden" />
                      <LogoMark className="hidden h-8 w-auto text-indigo-600 lg:block " />
                    </>
                  </Link>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <Avatar size="sm" image={session?.user?.image} />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/settings"
                            className={classNames(
                              active ? "bg-gray-100 text-indigo-700" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => {
                              signOut();
                              window.location.href = "/signin";
                            }}
                            className={classNames(
                              active ? "bg-gray-100 text-indigo-700" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
