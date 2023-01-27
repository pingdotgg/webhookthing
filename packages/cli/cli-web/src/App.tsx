import { JsonBlobs } from "./components/jsonblobs";
import { EndpointSetting } from "./components/endpointsetting";
import { LogoMark } from "./components/common/logo";

import { Disclosure } from "@headlessui/react";

export default function Example() {
  return (
    <>
      <div className="min-h-full">
        <div className="bg-gray-800 pb-32">
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                  <div className="border-b border-gray-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                      <div className="flex items-center">
                        <div className="flex flex-shrink-0 items-center text-gray-50">
                          <LogoMark className="block h-8 w-auto" />
                          <h1 className="ml-2 text-2xl font-bold">
                            Webhook Thing (by <a href="https://ping.gg">Ping</a>
                            )
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
