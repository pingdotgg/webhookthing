import { CliApiRouter } from "@captain/cli-core";
import { PlayIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { inferRouterOutputs } from "@trpc/server";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import { Nav } from "./breadcrumbs";
import Button from "./common/button";

import { cliApi } from "../utils/api";
import { classNames } from "../utils/classnames";
import {
  generateConfigFromState,
  generatePrefillFromConfig,
} from "../utils/configTransforms";

const jsonValidator = () =>
  z.string().refine(
    (v) => {
      if (!v) return true;
      try {
        JSON.parse(v);
        return true;
      } catch (e) {
        return false;
      }
    },
    { message: "Invalid JSON" }
  );

const formValidator = z.object({
  name: z.string().max(100).min(1, { message: "Required" }),
  body: z.optional(jsonValidator()),
  config: z.object({
    url: z
      .string()
      .min(1, { message: "Required" })
      .trim()
      .url()
      .refine((v) => v.match(/^https?:\/\//), {
        message: "Must start with http(s):// ",
      }),
    headers: z
      .array(z.object({ key: z.string(), value: z.string() }))
      .optional(),
    query: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  }),
});

type DataResponse = inferRouterOutputs<CliApiRouter>["parseUrl"];
export type FileDataType = Extract<DataResponse, { type: "file" }>["data"];

export const FileRunner = (input: { path: string; data: FileDataType }) => {
  const { path: file, data } = input;

  const path = decodeURI(file).split("/").slice(0, -1);

  if (path[0] === "") {
    path.shift();
  }

  const ctx = cliApi.useContext();

  const { mutate: updateHook } = cliApi.updateHook.useMutation({
    onSuccess: async () => {
      await ctx.parseUrl.invalidate();
    },
  });

  const { mutate: runFile } = cliApi.runFile.useMutation();

  const prefill = {
    name: data.name ?? "",
    body: data.body,
    config: generatePrefillFromConfig(input.data.config ?? {}),
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
    trigger,
  } = useForm({
    defaultValues: prefill,
    resolver: zodResolver(formValidator),
    mode: "onBlur",
  });

  const {
    fields: headerFields,
    remove: removeHeader,
    append: appendHeader,
  } = useFieldArray({
    control,
    name: "config.headers",
  });
  const {
    fields: queryFields,
    remove: removeQuery,
    append: appendQuery,
  } = useFieldArray({
    control,
    name: "config.query",
  });

  const updateQuery = () => {
    // get url & query from config
    const url = getValues("config.url")?.split("?")[0] ?? "";
    const query = getValues("config.query");

    if (!query?.length) {
      setValue("config.url", url);
      return;
    }

    // construct new url with query
    const newUrl = `${url}?${query
      .map((q) => `${q.key}=${q.value as string}`)
      .join("&")}`;

    // set new url
    setValue("config.url", newUrl);
  };

  const submitHandler = handleSubmit((data) =>
    updateHook({
      name: data.name,
      body: data.body ?? "",
      config: generateConfigFromState(data.config ?? {}),
      path,
    })
  );

  const { mutate: openFile } = cliApi.openFile.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full flex-col">
          {/* breadcrumbs */}
          <Nav
            path={file}
            actions={[
              {
                type: "splitButton",
                label: "Open File",
                onClick: () => openFile({ path: file }),
                items: [
                  {
                    name: "hookname.json",
                    type: "button",
                    action: () => openFile({ path: file }),
                  },
                  {
                    name: "hookname.config.json",
                    type: "button",
                    action: () =>
                      // this is creating a folder instead of a file on windows
                      openFile({
                        path: file.replace(".json", ".config.json"),
                      }),
                  },
                ],
              },
              {
                type: "button",
                label: `Run`,
                iconPosition: "end",
                icon: <PlayIcon />,
                onClick: () => {
                  void trigger();
                  if (JSON.stringify(prefill) !== JSON.stringify(getValues())) {
                    updateHook(
                      {
                        name: getValues("name"),
                        body: getValues("body") ?? "",
                        config: generateConfigFromState(
                          getValues("config") ?? {}
                        ),
                        path,
                      },
                      { onSuccess: () => runFile({ file: decodeURI(file) }) }
                    );
                  } else {
                    runFile({ file: decodeURI(file) });
                  }
                },
              },
            ]}
          />
          <div className="flex min-h-0 w-full grow flex-col items-start overflow-y-scroll ">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {`Settings: ${prefill.name}`}
                </h3>
                <div className="mt-2 flex min-h-0 flex-col gap-2">
                  <p className="text-sm text-gray-500">
                    {`Configure your webhook below.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <form
              onSubmit={(e) => void submitHandler(e)}
              id="form"
              className="space-y-3 py-2"
            >
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  {`URL`}
                </label>
                <p className="text-sm text-red-500">
                  {errors.config?.url?.message}
                </p>
                <input
                  id="url"
                  className="block w-full rounded-md border  border-gray-300 px-3 py-1.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  {...register("config.url", {
                    onBlur: (e: React.FormEvent<HTMLInputElement>) => {
                      void trigger();
                      const value = e.currentTarget.value;
                      if (value) {
                        const url = new URL(value);
                        const queryFields = Array.from(
                          url.searchParams.entries()
                        ).map(([key, value]) => ({
                          key,
                          value,
                        }));
                        setValue("config.query", queryFields);
                      }
                    },
                  })}
                />
              </div>
              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-gray-700"
                >
                  {`Body`}
                </label>
                {errors.body && (
                  <p className="text-sm text-red-500">{errors.body.message}</p>
                )}
                <textarea
                  id="body"
                  className="mt-1 block h-96 w-full rounded-md border-gray-300 font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  {...register("body", {})}
                />
              </div>
              <div>
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700">
                    {`Headers`}
                  </legend>
                  <p className="text-sm text-red-500">
                    {errors.config?.headers?.message}
                  </p>
                  <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                    <div className="flex flex-col -space-y-px">
                      {headerFields.map((item, index) => (
                        <div className="flex -space-x-px" key={item.id}>
                          <div className="w-1/4 min-w-0 flex-1">
                            <label
                              htmlFor={`config.headers.${index}.key`}
                              className="sr-only"
                            >
                              {`Key`}
                            </label>
                            <input
                              id={`config.headers.${index}.key`}
                              className={classNames(
                                "relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent px-3 py-1.5 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                                index === 0 ? "rounded-tl-md" : ""
                              )}
                              {...register(
                                `config.headers.${index}.key` as const
                              )}
                              defaultValue={item.key}
                              placeholder="Key"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <label
                              htmlFor={`config.headers.${index}.value`}
                              className="sr-only"
                            >
                              {`Value`}
                            </label>
                            <input
                              id={`config.headers.${index}.value`}
                              className="relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent px-3 py-1.5 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              {...register(
                                `config.headers.${index}.value` as const
                              )}
                              defaultValue={item.value as string}
                              placeholder="Value"
                            />
                          </div>
                          <div className="flex items-center">
                            <button
                              className={classNames(
                                "relative inline-flex h-full items-center rounded-none border border-gray-300 bg-white px-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                index === 0 ? "rounded-tr-md" : ""
                              )}
                              type="button"
                              onClick={() => removeHeader(index)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className={classNames(
                      "-mt-[1px] flex w-full flex-row items-center gap-1  border border-gray-300 bg-white px-4 py-1.5 text-start text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 ",
                      headerFields.length !== 0 ? "rounded-b-md" : "rounded-md"
                    )}
                    type="button"
                    onClick={() => appendHeader({ key: "", value: "" })}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>{`Add Header`}</span>
                  </button>
                </fieldset>
              </div>
              <div>
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700">
                    {`Query Parameters`}
                  </legend>
                  <p className="text-sm text-red-500">
                    {errors.config?.query?.message}
                  </p>
                  <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                    <div className="flex flex-col -space-y-px">
                      {queryFields.map((item, index) => (
                        <div className="flex -space-x-px" key={item.id}>
                          <div className="w-1/4 min-w-0 flex-1">
                            <label
                              htmlFor={`config.query.${index}.key`}
                              className="sr-only"
                            >
                              {`Key`}
                            </label>
                            <input
                              id={`config.query.${index}.key`}
                              className={classNames(
                                "relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent px-3 py-1.5 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                                index === 0 ? "rounded-tl-md" : ""
                              )}
                              {...(register(
                                `config.query.${index}.key` as const
                              ),
                              {
                                onBlur: (e) => {
                                  setValue(
                                    `config.query.${index}.key`,
                                    e.target.value
                                  );
                                  updateQuery();
                                },
                              })}
                              defaultValue={item.key}
                              placeholder="Key"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <label
                              htmlFor={`config.query.${index}.value`}
                              className="sr-only"
                            >
                              {`Value`}
                            </label>
                            <input
                              id={`config.query.${index}.value`}
                              className="relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent px-3 py-1.5 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              {...register(
                                `config.query.${index}.value` as const,
                                {
                                  onBlur: (
                                    e: React.FormEvent<HTMLInputElement>
                                  ) => {
                                    setValue(
                                      `config.query.${index}.value`,
                                      e.currentTarget.value
                                    );
                                    updateQuery();
                                  },
                                }
                              )}
                              defaultValue={item.value as string}
                              placeholder="Value"
                            />
                          </div>
                          <div className="flex items-center">
                            <button
                              className={classNames(
                                "relative inline-flex h-full items-center rounded-none border border-gray-300 bg-white px-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                                index === 0 ? "rounded-tr-md" : ""
                              )}
                              type="button"
                              onClick={() => {
                                removeQuery(index);
                                updateQuery();
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className={classNames(
                      "-mt-[1px] flex w-full flex-row items-center gap-1  border border-gray-300 bg-white px-4 py-1.5 text-start text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 ",
                      queryFields.length !== 0 ? "rounded-b-md" : "rounded-md"
                    )}
                    type="button"
                    onClick={() => appendQuery({ key: "", value: "" })}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>{`Add Query Param`}</span>
                  </button>
                </fieldset>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-auto flex flex-row justify-end pt-4">
          <Button
            type="submit"
            form="form"
            size="lg"
            variant="indigo"
            disabled={!isValid}
          >
            {`Save Changes`}
          </Button>
        </div>
      </div>
    </>
  );
};
