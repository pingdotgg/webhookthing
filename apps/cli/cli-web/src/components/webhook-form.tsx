import {
  configValidator,
  ConfigValidatorType,
} from "@captain/cli-core/src/update-config";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodString, ZodRecord } from "zod";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

const formValidator = z.object({
  name: z.string().max(20),
  body: z.string().optional(),
  config: z.object({
    url: z.string().optional(),
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

export const WebhookForm = (input: {
  prefill: FormValidatorType;
  submitAction: (input: FormValidatorType) => void;
}) => {
  const { prefill, submitAction } = input;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: prefill,
    resolver: zodResolver(formValidator),
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
    submitAction(data);
  };

  const updateQuery = () => {
    //get url & query from config
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Name
      </label>
      <p className="text-sm text-red-500">{errors.name?.message}</p>
      <input
        id="name"
        className="block w-full rounded-md border border-gray-300 p-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        {...register("name", { required: true, maxLength: 20 })}
      />
      <label htmlFor="body" className="block text-sm font-medium text-gray-700">
        Body
      </label>
      <p className="text-sm text-red-500">{errors.body?.message}</p>
      <textarea
        id="body"
        className="mt-1 block h-96 w-full rounded-md border-gray-300 font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        {...register("body")}
      />
      <label htmlFor="url" className="block text-sm font-medium text-gray-700">
        URL
      </label>
      <p className="text-sm text-red-500">{errors.config?.url?.message}</p>
      <input
        id="url"
        className="block w-full rounded-md border  border-gray-300 p-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        {...register("config.url", {
          onBlur: (e) => {
            const value = e.target.value;
            if (value) {
              const url = new URL(value);
              const queryFields = Array.from(url.searchParams.entries()).map(
                ([key, value]) => ({
                  key,
                  value,
                })
              );
              setValue("config.query", queryFields);
            }
          },
        })}
      />
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700">
          Headers
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
                    Key
                  </label>
                  <input
                    id={`config.headers.${index}.key`}
                    className={classNames(
                      "relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent p-1 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      index === 0 ? "rounded-tl-md" : ""
                    )}
                    {...register(`config.headers.${index}.key` as const)}
                    defaultValue={item.key}
                    placeholder="Key"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`config.headers.${index}.value`}
                    className="sr-only"
                  >
                    Value
                  </label>
                  <input
                    id={`config.headers.${index}.value`}
                    className="relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent p-1 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...register(`config.headers.${index}.value` as const)}
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
          <span>Add Header</span>
        </button>
      </fieldset>
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700">
          Query Parameters
        </legend>
        <p className="text-sm text-red-500">{errors.config?.query?.message}</p>
        <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
          <div className="flex flex-col -space-y-px">
            {queryFields.map((item, index) => (
              <div className="flex -space-x-px" key={item.id}>
                <div className="w-1/4 min-w-0 flex-1">
                  <label
                    htmlFor={`config.query.${index}.key`}
                    className="sr-only"
                  >
                    Key
                  </label>
                  <input
                    id={`config.query.${index}.key`}
                    className={classNames(
                      "relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent p-1 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      index === 0 ? "rounded-tl-md" : ""
                    )}
                    {...(register(`config.query.${index}.key` as const),
                    {
                      onBlur: (e) => {
                        setValue(`config.query.${index}.key`, e.target.value);
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
                    Value
                  </label>
                  <input
                    id={`config.query.${index}.value`}
                    className="relative block w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-transparent p-1 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    {...register(`config.query.${index}.value` as const, {
                      onBlur: (e) => {
                        setValue(`config.query.${index}.value`, e.target.value);
                        updateQuery();
                      },
                    })}
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
          <span>Add Query Param</span>
        </button>
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  );
};
