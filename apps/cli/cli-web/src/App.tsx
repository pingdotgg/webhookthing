import { JsonBlobs } from "./components/jsonblobs";
import { EndpointSetting } from "./components/endpointsetting";

import { Disclosure } from "@headlessui/react";

import { Toaster } from "react-hot-toast";

export default function Example() {
  return (
    <>
      <Toaster />
      <div className="min-h-full">
        <div className="bg-gray-800 bg-gradient-to-r from-indigo-800/40 pb-32">
          <Disclosure as="nav" className="">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                  <div className="border-b border-gray-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                      <div className="flex items-center">
                        <div className="flex flex-shrink-0 items-center text-gray-50">
                          <h1 className="ml-2 text-4xl font-bold">
                            <span className="tracking-tight">
                              webhook
                              <span className="text-indigo-500">thing</span>
                            </span>
                            <span className="text-lg">
                              ...by <a href="https://ping.gg">Ping</a>
                            </span>
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Disclosure>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
              <div className="flex flex-col gap-4 divide-y divide-gray-200 rounded-lg border-gray-200">
                <EndpointSetting />
                <JsonBlobs />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
