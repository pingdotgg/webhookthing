import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

import { trpc } from "../utils/trpc";
import { useRequireAuth } from "../utils/use-require-auth";
import SplitButtonDropdown from "../components/common/button";

import type { RequestObject, Destination } from "@prisma/client";

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
  useRequireAuth();

  const { data: session, status } = useSession();
  const { data: requests } = trpc.customer.allWebRequests.useQuery();
  const { data: destinations } = trpc.customer.allDestinations.useQuery();

  const [selectedRequest, setSelectedRequest] = useState("");

  if (status === "loading" || !session) return null;

  return (
    <>
      {/* Main 3 column grid */}
      <div className="mx-auto grid h-[80vh] max-w-7xl grid-cols-1 grid-rows-1 items-start gap-4 py-6 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-8">
        {/* Left column */}
        <div className="row-span-1 grid h-full grid-cols-1 gap-4">
          <section aria-labelledby="section-1-title">
            <h2 className="sr-only" id="section-1-title">
              Requests
            </h2>
            <div className="h-full overflow-hidden rounded-lg bg-white shadow">
              <div className="h-full">
                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Requests
                  </h3>
                </div>
                <ul
                  role="list"
                  className="h-full divide-y divide-gray-200 overflow-y-auto"
                >
                  {requests ? (
                    requests.map((r) => {
                      return (
                        <li
                          key={r.id}
                          className={classNames(
                            "items-right flex flex-col px-6 py-3 text-sm odd:bg-gray-100 hover:bg-gray-300",
                            {
                              "!bg-gray-300": r.id === selectedRequest,
                            }
                          )}
                          onClick={() => setSelectedRequest(r.id)}
                        >
                          <div className="flex gap-2">
                            <span
                              className={classNames(
                                `inline-flex shrink-0 items-center rounded-sm py-0.5 px-1.5 text-xs  font-normal  capitalize text-white`,
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
                        "flex items-center justify-between px-6 py-3 text-sm odd:bg-gray-100"
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
        <div className="row-span-1 grid grid-cols-1 gap-4 lg:col-span-2">
          <section aria-labelledby="section-2-title">
            <h2 className="sr-only" id="section-2-title">
              Request Details
            </h2>
            {requests && (
              <RequestInfo
                request={requests.find((r) => r.id === selectedRequest)}
                destinations={destinations ?? []}
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
  destinations: Destination[];
}> = ({ request, destinations }) => {
  if (!request) {
    return (
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between py-3 sm:flex-nowrap sm:px-6">
          <div className="ml-4 mt-2">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
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

  const { mutate: replay } = trpc.webhook.replay.useMutation({});

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between py-3 sm:flex-nowrap sm:px-6">
        <div className="ml-4 mt-2">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Request Details
          </h3>
        </div>
        <div className="ml-4 mt-2 flex flex-shrink-0 gap-1">
          <SplitButtonDropdown
            label="Replay"
            icon={<ArrowPathIcon className="test-white h-4 w-4" />}
            onClick={() => {
              replay({ id: request.id });
            }}
            items={(destinations ?? []).map((d) => {
              return {
                name: d.name,
                action: () => {
                  replay({
                    id: request.id,
                    destinations: [d.id],
                  });
                },
              };
            })}
          />
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
              <div className="max-h-[15vh] overflow-y-auto rounded-md border border-gray-200 p-2">
                <ul role="list" className="divide-y divide-gray-200">
                  {Object.entries(request.headers ?? {}).map(([key, value]) => (
                    <li
                      key={key}
                      className="flex items-center justify-between py-1.5 pl-3 pr-4 font-mono text-sm odd:bg-gray-100"
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <span className="ml-2 w-0 flex-1 text-ellipsis">
                          {key}
                        </span>
                      </div>
                      <div className="ml-4 w-2/3 flex-shrink-0 text-ellipsis">
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
              <div className="max-h-[35vh] overflow-y-auto whitespace-pre rounded-md bg-gray-100 p-2 font-mono">
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
