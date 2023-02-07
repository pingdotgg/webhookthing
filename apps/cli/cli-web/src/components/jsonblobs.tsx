import {
  ArrowPathIcon,
  CloudArrowDownIcon,
  CogIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
  PlayIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { cliApi } from "../utils/api";
import { useCurrentUrl } from "../utils/useCurrentUrl";

import { WebhookFormModal } from "./webhook-form";
import { Tooltip } from "./common/tooltip";

const HOOKS_FOLDER = ".thing/hooks";

export const JsonBlobs = () => {
  const { data, refetch: refetchBlobs } = cliApi.getBlobs.useQuery();

  const { mutate: runFile } = cliApi.runFile.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: openFolder } = cliApi.openFolder.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: getSampleHooks, isLoading } =
    cliApi.getSampleHooks.useMutation({
      onSuccess: () => {
        setTimeout(() => refetchBlobs(), 150);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

  const [expanded, setExpanded] = useState<number[]>([]);

  const [storedEndpoint] = useCurrentUrl();

  const addModalState = useState(false);

  const [selectedHookName, setSelectedHook] = useState<string>("");

  const selectedHook = data?.find((x) => x.name === selectedHookName);

  return (
    <>
      <WebhookFormModal type="create" openState={addModalState} />
      {selectedHook && (
        <WebhookFormModal
          type="update"
          openState={[
            true,
            () => {
              setSelectedHook("");
            },
          ]}
          prefill={selectedHook}
          onClose={() => {
            setSelectedHook("");
          }}
        />
      )}

      <div className="flex flex-col gap-2 pt-4">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {`Your Webhooks`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {`(put json files in ${HOOKS_FOLDER})`}
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <button
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => openFolder({ path: "" })}
            >
              {`Open Hooks Folder`}
            </button>
            <button
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => addModalState[1](true)}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {data?.length ? (
          <ul role="list" className="space-y-3">
            {data.map((blob, i) => (
              <li
                key={blob.name}
                className="group flex flex-col items-start justify-between gap-2 overflow-hidden rounded-md bg-white px-6 py-4 shadow"
              >
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-1 text-xl ">
                    {blob.name}
                    {(blob.config?.url || blob.config?.headers) && (
                      <Tooltip content="This has a custom config">
                        <InformationCircleIcon className="h-5 w-5 text-gray-800" />
                      </Tooltip>
                    )}
                  </div>
                  <div className=" flex flex-row items-center gap-x-4 ">
                    <button
                      className="invisible group-hover:visible"
                      onClick={() => {
                        setExpanded((prev) =>
                          prev.includes(i)
                            ? prev.filter((x) => x !== i)
                            : [...prev, i]
                        );
                      }}
                    >
                      {expanded.includes(i) ? (
                        <EyeSlashIcon className="h-4" />
                      ) : (
                        <EyeIcon className="h-4 hover:text-indigo-600" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        runFile({ file: blob.name, url: storedEndpoint });
                      }}
                    >
                      <PlayIcon className="h-4 hover:text-indigo-600" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedHook(blob.name);
                      }}
                    >
                      <CogIcon className="h-4 hover:text-indigo-600" />
                    </button>
                  </div>
                </div>
                {expanded.includes(i) && (
                  <div className="flex w-full flex-col gap-2">
                    {blob.config?.url && (
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-gray-500">{`URL:`}</span>
                        <span className="text-gray-800">{blob.config.url}</span>
                      </div>
                    )}
                    {blob.config?.headers && (
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-gray-500">{`Headers:`}</span>
                        <span className="text-gray-800">
                          {JSON.stringify(blob.config.headers)}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-500">{`Body:`}</span>
                    <pre className="w-full overflow-auto rounded-md bg-gray-200 p-4">
                      <code>{blob.body}</code>
                    </pre>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white-50 rounded-md p-6 text-center shadow-lg">
            <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {`No Webhooks`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {`Get started with our sample webhooks by clicking the button below,
            or add your own payloads to the ${HOOKS_FOLDER} folder.`}
            </p>
            <div className="mt-6">
              {isLoading ? (
                <ArrowPathIcon className="inline-flex h-5 w-5 animate-spin items-center justify-center text-gray-600" />
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => getSampleHooks()}
                >
                  <CloudArrowDownIcon
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  {`Download Sample Webhooks`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
