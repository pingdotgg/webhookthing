import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ArrowPathIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { trpc } from "../utils/trpc";
import type { RequestObject } from "@prisma/client";

const METHOD_COLORS = {
  GET: "bg-blue-500",
  POST: "bg-green-500",
  PUT: "bg-amber-500",
  DELETE: "bg-red-500",
  PATCH: "bg-purple-500",
  HEAD: "bg-gray-500",
  OPTIONS: "bg-gray-500",
  CONNECT: "bg-gray-500",
  TRACE: "bg-gray-500",
};

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: requests } = trpc.customer.allWebRequests.useQuery();

  const [selectedRequest, setSelectedRequest] = useState("");

  if (status === "loading" || !session) return null;

  return (
    <>
      {/* Main 3 column grid */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 h-[80vh] grid grid-cols-1 grid-rows-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 row-span-1 h-full">
          <section aria-labelledby="section-1-title">
            <h2 className="sr-only" id="section-1-title">
              Requests
            </h2>
            <div className="rounded-lg bg-white overflow-hidden shadow h-full">
              <div className="h-full">
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Requests
                  </h3>
                </div>
                <ul
                  role="list"
                  className="divide-y divide-gray-200 h-full overflow-y-auto"
                >
                  {requests ? (
                    requests.map((r) => {
                      return (
                        <li
                          key={r.id}
                          className={classNames(
                            "px-6 py-3 flex items-right flex-col text-sm odd:bg-gray-100 hover:bg-gray-300",
                            {
                              "!bg-gray-300": r.id === selectedRequest,
                            }
                          )}
                          onClick={() => setSelectedRequest(r.id)}
                        >
                          <div className="flex gap-2">
                            <span
                              className={classNames(
                                `inline-flex shrink-0 items-center py-0.5 px-1.5 text-xs font-normal  capitalize  rounded-sm text-white`,
                                METHOD_COLORS[r.method]
                              )}
                            >
                              {r.method}
                            </span>
                            <span>{r.id}</span>
                          </div>
                          <span className="text-sm">
                            {r.timestamp.toLocaleString()}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <li
                      className={classNames(
                        "px-6 py-3 flex items-center justify-between text-sm odd:bg-gray-100"
                      )}
                    >
                      No requests yet!
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2 row-span-1">
          <section aria-labelledby="section-2-title">
            <h2 className="sr-only" id="section-2-title">
              Request Details
            </h2>
            {requests && (
              <RequestInfo
                request={requests.find((r) => r.id === selectedRequest)}
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;

const RequestInfo: React.FC<{
  request?: RequestObject;
}> = ({ request }) => {
  if (!request) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="py-3 sm:px-6 -ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Request Details
            </h3>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          Select a request to see more details!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="py-3 sm:px-6 -ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Request Details
          </h3>
        </div>
        <div className="flex ml-4 mt-2 flex-shrink-0 gap-1">
          <button
            type="button"
            className="relative gap-2 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowPathIcon className="test-white w-4 h-4" /> Replay
          </button>
          <button
            type="button"
            className="relative gap-2 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ClipboardIcon className="test-white w-4 h-4" />
            Copy cURL
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Source</dt>
            <dd className="mt-1 text-sm text-gray-900">{request.host}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Endpoint</dt>
            <dd className="mt-1 text-sm text-gray-900">{request.endpoint}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Method</dt>
            <dd className="mt-1 text-sm text-gray-900">{request.method}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Identifier</dt>
            <dd className="mt-1 text-sm text-gray-900">{request.id}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {request.timestamp.toLocaleString()}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Size</dt>
            <dd className="mt-1 text-sm text-gray-900">{request.size} bytes</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Headers</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div className="max-h-[15vh] overflow-y-auto border border-gray-200 rounded-md ">
                <ul role="list" className="divide-y divide-gray-200">
                  {Object.entries(request.headers ?? {}).map(([key, value]) => (
                    <li
                      key={key}
                      className="pl-3 pr-4 py-1.5 flex items-center justify-between text-sm odd:bg-gray-100 font-mono"
                    >
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 text-ellipsis">
                          {key}
                        </span>
                      </div>
                      <div className="w-2/3 ml-4 flex-shrink-0 text-ellipsis">
                        {value}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Body</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div className=" max-h-[35vh] overflow-y-auto bg-gray-100 rounded-md p-2 whitespace-pre font-mono">
                {request.body
                  ? JSON.stringify(JSON.parse(request.body ?? "{}"), null, 2)
                  : "Request has no body"}
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
