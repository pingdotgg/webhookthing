import { Disclosure } from "@headlessui/react";
import { Toaster } from "react-hot-toast";

import { JsonBlobs } from "./components/jsonblobs";
import { EndpointSetting } from "./components/endpointsetting";
import { useConnectionStateToasts } from "./utils/useConnectionStateToasts";
import { ResponseViewer } from "./components/response-viewer";

const SubscriptionsHelper = () => {
  useConnectionStateToasts();

  return null;
};

export default function AppCore() {
  return (
    <>
      <Toaster />
      <SubscriptionsHelper />
      <div className="flex h-screen min-h-full flex-col">
        <div className="pattern pb-32">
          <Disclosure as="nav">
            {() => (
              <>
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
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
                <ResponseViewer />
              </div>
            </div>
          </div>
        </main>

        <footer className="pattern bottom-0 mt-auto">
          <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="text-center text-base text-gray-400">
              <p>
                <a
                  href="https://docs.webhookthing.com"
                  className="text-white hover:text-indigo-400"
                  target="_blank"
                  rel="noreferrer"
                >
                  {`Questions? Check out the docs!`}
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
