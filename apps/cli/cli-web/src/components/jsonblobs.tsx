import {
  ArrowPathIcon,
  CloudArrowDownIcon,
  CogIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { cliApi } from "../utils/api";
import { useCurrentUrl } from "../utils/useCurrentUrl";
import { Modal } from "./common/modal";

import { ConfigValidatorType } from "@captain/cli-core/src/trpc";

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
      <FormModal type="add" openState={addModalState} />
      {selectedHook && (
        <FormModal
          type="edit"
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
              Your Webhooks
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
              Open Hooks Folder
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
                  <div className="text-xl">{blob.name}</div>
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
                  <pre className="w-full overflow-auto rounded-md bg-gray-200 p-4">
                    <code>{blob.body}</code>
                  </pre>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white-50 rounded-md p-6 text-center shadow-lg">
            <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No Webhooks
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
                  Download Sample Webhooks
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const FormModal: React.FC<{
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  type: "edit" | "add";
  prefill?: {
    name: string;
    body: string;
    config?: ConfigValidatorType;
  };
  onClose?: () => void;
}> = ({ openState, type, prefill, onClose }) => {
  const ctx = cliApi.useContext();
  const { mutate: updateHook } = cliApi.updateHook.useMutation({
    onSuccess: () => {
      ctx.getBlobs.invalidate();
    },
  });
  const { mutate: addHook } = cliApi.createHook.useMutation({
    onSuccess: () => {
      ctx.getBlobs.invalidate();
    },
  });

  const [name, setName] = useState<string>(prefill?.name ?? "");
  const [body, setBody] = useState<string>(prefill?.body ?? "");

  const [showAddlOpts, setShowAddlOpts] = useState<boolean>(false);
  const [url, setUrl] = useState<string>(prefill?.config?.url ?? "");
  const [query, setQuery] = useState<{ key: string; value: string }[]>(
    prefill?.config?.query
      ? convertObjectStateToArray(prefill.config.query)
      : []
  );
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>(
    prefill?.config?.headers
      ? convertObjectStateToArray(prefill.config.headers)
      : []
  );

  const updateUrl = (url: string) => {
    setUrl(url);
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const newQuery = Array.from(queryParams.entries()).map(([key, value]) => ({
      key,
      value,
    }));
    setQuery(newQuery);
  };

  const updateQuery = (query: { key: string; value: string }[]) => {
    setQuery(query);
    if (!url) return;

    const parsedUrl = new URL(url.includes("http") ? url : `http://${url}`);
    query.forEach(({ key, value }) => {
      parsedUrl.searchParams.set(key, value);
    });
    //delete any params that do not appear in the query
    Array.from(parsedUrl.searchParams.keys()).forEach((key) => {
      if (!query.find((q) => q.key === key)) {
        parsedUrl.searchParams.delete(key);
      }
    });
    setUrl(parsedUrl.toString());
  };

  const generateConfig = () => {
    const config: ConfigValidatorType = {};
    if (url) config.url = url;
    if (query.length) config.query = convertArrayStateToObject(query);
    if (headers.length) config.headers = convertArrayStateToObject(headers);
    return config;
  };

  return (
    <Modal openState={openState} onClose={onClose}>
      <div className="relative flex h-full w-full grow transform flex-col overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:p-6 sm:pr-20">
        <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => openState[1](false)}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 w-full grow overflow-y-scroll px-4 sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
            {type === "edit" ? (
              <CogIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            ) : (
              <PlusIcon
                className="h-6 w-6 text-indigo-600"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="h-full w-full grow pt-3 text-left sm:ml-4 sm:pt-0">
            <h3 className="text-center font-medium leading-6 text-gray-900 sm:text-left">
              {type === "edit" ? (
                <>Settings: {prefill?.name}</>
              ) : (
                <>Add a new webhook</>
              )}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {type === "edit" ? (
                  <>Update your webhook&apos;s settings below.</>
                ) : (
                  <>
                    Give your webhook a name and paste the body contents below.
                  </>
                )}
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2 overflow-y-scroll">
              <div id="name-input">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="My Webhook"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div id="body-input">
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-gray-700"
                >
                  Body
                </label>
                <div className="mt-1">
                  <textarea
                    id="body"
                    name="body"
                    rows={3}
                    className="mt-1 block h-96 w-full rounded-md border-gray-300 font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="{}"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              </div>

              {!showAddlOpts ? (
                <button
                  type="button"
                  className="text-sm text-indigo-600"
                  onClick={() => setShowAddlOpts(true)}
                >
                  Show Additional Options
                </button>
              ) : (
                <>
                  <div id="url-input">
                    <label
                      htmlFor="url"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Endpoint URL
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="url"
                        id="url"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="https://example.com/webhook"
                        value={url}
                        onChange={(e) => updateUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <div id="query-input">
                    <KeyValueInput
                      label="Query Parameter"
                      values={query}
                      setValues={updateQuery}
                    />
                  </div>
                  <div id="headers-input">
                    <KeyValueInput
                      label="Header"
                      values={headers}
                      setValues={setHeaders}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-sm text-indigo-600"
                    onClick={() => setShowAddlOpts(false)}
                  >
                    Hide Additional Options
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 px-4 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-600/80 sm:ml-3 sm:w-auto sm:text-sm"
            disabled={!name || !body}
            onClick={
              type === "edit"
                ? () => {
                    if (!name || !body) return;
                    updateHook({
                      name: name,
                      body: body,
                      config: generateConfig(),
                    });
                    openState[1](false);
                  }
                : () => {
                    if (!name || !body) return;
                    addHook({
                      name: name,
                      body: body,
                      config: generateConfig(),
                    });
                    openState[1](false);
                  }
            }
          >
            Save Changes
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => {
              openState[1](false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const convertArrayStateToObject = (arr: { key: string; value: string }[]) => {
  return arr.reduce((acc: { [k: string]: string }, curr) => {
    if (curr.key) {
      acc[curr.key] = curr.value;
    }
    return acc;
  }, {});
};

const convertObjectStateToArray = (obj: { [k: string]: string }) => {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
};

const KeyValueInput = ({
  label,
  values,
  setValues,
}: {
  label: string;
  values: { key: string; value: string }[];
  setValues: (values: { key: string; value: string }[]) => void;
}) => {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-700">
        {label}s
      </legend>
      <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
        <div className="flex flex-col -space-y-px">
          {values.map((kv, i) => (
            <div className="flex -space-x-px" id={`${label.toLowerCase()}${i}`}>
              <div className="w-1/4 min-w-0 flex-1">
                <label
                  htmlFor={`${label.toLowerCase()}key${i}`}
                  className="sr-only"
                >
                  {label} Key
                </label>
                <input
                  type="text"
                  name={`${label.toLowerCase()}key${i}`}
                  id={`${label.toLowerCase()}key${i}`}
                  className={classNames(
                    "relative block w-full rounded-none border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                    i === 0 ? "rounded-tl-md" : "",
                    values.filter((h) => h.key == kv.key).length > 1 && kv.key
                      ? "text-red-500"
                      : ""
                  )}
                  placeholder="somekeyhere"
                  value={kv.key}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[i].key = e.target.value;
                    setValues(newValues);
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`${label.toLowerCase()}val${i}`}
                  className="sr-only"
                >
                  {label} Value
                </label>
                <input
                  type="text"
                  name={`${label.toLowerCase()}val${i}`}
                  id={`${label.toLowerCase()}val${i}`}
                  className="relative block w-full rounded-none border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="somevaluehere"
                  value={kv.value}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[i].value = e.target.value;
                    setValues(newValues);
                  }}
                />
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className={classNames(
                    "relative inline-flex h-full items-center rounded-none border border-gray-300 bg-white px-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                    i === 0 ? "rounded-tr-md" : ""
                  )}
                  onClick={() => {
                    const newValues = [...values];
                    newValues.splice(i, 1);
                    setValues(newValues);
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <button
            type="button"
            className={classNames(
              "flex w-full flex-row items-center gap-1  border border-gray-300 bg-white px-4 py-2 text-start text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 ",
              Object.keys(values).length !== 0 ? "rounded-b-md" : "rounded-md"
            )}
            onClick={() => {
              const newValues = [...values, { key: "", value: "" }];
              setValues(newValues);
            }}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add a {label}</span>
          </button>
        </div>
      </div>
    </fieldset>
  );
};
