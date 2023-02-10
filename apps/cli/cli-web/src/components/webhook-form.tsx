import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CogIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { ConfigValidatorType } from "@captain/cli-core/src/update-config";
import { cliApi } from "../utils/api";
import { Modal } from "./common/modal";

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
  name: z.string().max(20).min(1, { message: "Required" }),
  body: z.optional(jsonValidator()),
  config: z.object({
    url: z.union([z.literal(""), z.string().trim().url()]),
    headers: z
      .array(z.object({ key: z.string(), value: z.string() }))
      .optional(),
    query: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  }),
});

type FormValidatorType = z.infer<typeof formValidator>;

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const WebhookFormModal = (input: {
  type: "create" | "update";
  prefill?: FormValidatorType;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  onClose?: () => void;
}) => {
  const ctx = cliApi.useContext();
  const { mutate: updateHook } = cliApi.updateHook.useMutation({
    onSuccess: () => {
      ctx.getBlobs.invalidate();
      openState[1](false);
    },
  });
  const { mutate: addHook } = cliApi.createHook.useMutation({
    onSuccess: () => {
      ctx.getBlobs.invalidate();
      openState[1](false);
    },
  });

  const { type, prefill, openState, onClose } = input;
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

  const onSubmit = (data: FormValidatorType) => {
    if (type === "create") {
      addHook({
        name: data.name,
        body: data.body ?? "",
        config: generateConfigFromState(data.config),
      });
    } else {
      updateHook({
        name: data.name,
        body: data.body ?? "",
        config: generateConfigFromState(data.config),
      });
    }
  };

  const updateQuery = () => {
    // get url & query from config
    const url = getValues("config.url")?.split("?")[0];
    const query = getValues("config.query");

    if (!query?.length) {
      setValue("config.url", url);
      return;
    }

    // construct new url with query
    const newUrl = `${url}?${query
      .map((q) => `${q.key}=${q.value}`)
      .join("&")}`;

    // set new url
    setValue("config.url", newUrl);
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
            <span className="sr-only">{`Close`}</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 w-full grow overflow-y-scroll px-4 sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
            {type === "update" ? (
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
              {type === "update" ? (
                <>{`Settings: ${prefill?.name}`}</>
              ) : (
                <>{`Add a new webhook`}</>
              )}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {type === "update" ? (
                  <>{`Update your webhook&apos;s settings below.`}</>
                ) : (
                  <>
                    {`Give your webhook a name and paste the body contents below.`}
                  </>
                )}
              </p>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit(onSubmit)} id="form">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {`Name`}
                </label>
                {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name?.message ?? errors.name.type}
                  </p>
                )}
                <input
                  id="name"
                  className="block w-full rounded-md border border-gray-300 p-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  {...register("name")}
                />
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
                  className="block w-full rounded-md border  border-gray-300 p-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  {...register("config.url", {
                    onBlur: (e) => {
                      trigger();
                      const value = e.target.value;
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
                                "relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent p-1 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
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
                              className="relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent p-1 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              {...register(
                                `config.headers.${index}.value` as const
                              )}
                              defaultValue={item.value}
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
                      "-mt-[1px] flex w-full flex-row items-center gap-1  border border-gray-300 bg-white px-4 py-1 text-start text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 ",
                      headerFields.length !== 0 ? "rounded-b-md" : "rounded-md"
                    )}
                    type="button"
                    onClick={() => appendHeader({ key: "", value: "" })}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>{`Add Header`}</span>
                  </button>
                </fieldset>
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
                                "relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent p-1 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
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
                              className="relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent p-1 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              {...register(
                                `config.query.${index}.value` as const,
                                {
                                  onBlur: (e) => {
                                    setValue(
                                      `config.query.${index}.value`,
                                      e.target.value
                                    );
                                    updateQuery();
                                  },
                                }
                              )}
                              defaultValue={item.value}
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
                      "-mt-[1px] flex w-full flex-row items-center gap-1  border border-gray-300 bg-white px-4 py-1 text-start text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 ",
                      queryFields.length !== 0 ? "rounded-b-md" : "rounded-md"
                    )}
                    type="button"
                    onClick={() => appendQuery({ key: "", value: "" })}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>{`Add Query Param`}</span>
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-5 px-4 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            form="form"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-600/80 sm:ml-3 sm:w-auto sm:text-sm"
            disabled={!isValid}
          >
            {`Save Changes`}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => {
              openState[1](false);
            }}
          >
            {`Cancel`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const convertArrayStateToObject = (arr: { key: string; value: string }[]) => {
  return arr.reduce((acc: { [k: string]: string }, curr) => {
    if (curr.key) {
      acc[curr.key] = curr.value;
    }
    return acc;
  }, {});
};

const generateConfigFromState = (state: {
  url?: string;
  headers?: { key: string; value: string }[];
  query?: { key: string; value: string }[];
}) => {
  const config: ConfigValidatorType = {};
  if (state.url) config.url = state.url;
  if (state.query?.length)
    config.query = convertArrayStateToObject(state.query ?? []);
  if (state.headers?.length)
    config.headers = convertArrayStateToObject(state.headers ?? []);
  return config;
};
