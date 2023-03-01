import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DocumentPlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";

import { cliApi } from "../utils/api";
import { Modal } from "./common/modal";

const formValidator = z.object({
  name: z.string().max(100).min(1, { message: "Required" }),
});

type FormValidatorType = z.infer<typeof formValidator>;

export const FileFormModal = (input: {
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  prefill?: FormValidatorType;
  onClose?: () => void;
  path: string[];
}) => {
  const { openState, onClose, prefill } = input;

  const ctx = cliApi.useContext();

  const { data: existing } = cliApi.getFilesAndFolders.useQuery({
    path: input.path,
  });

  const { mutate: createFile } = cliApi.createFile.useMutation({
    onSuccess: async ({ route }) => {
      await ctx.parseUrl.invalidate();
      onClose && onClose();
      openState[1](false);
      reset();
      window.open(route, "_blank");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    defaultValues: prefill,
    resolver: zodResolver(formValidator),
    mode: "onBlur",
  });

  const onSubmit = (data: FormValidatorType) => {
    // Don't allow duplicate names (this overwrites the existing hook)
    if (existing?.folders.find((b) => b === data.name)) {
      return toast.error("Folder with that name already exists");
    }
    createFile({
      name: data.name.trim(),
      path: input.path,
    });
  };

  const submitHandler = handleSubmit(onSubmit);

  return (
    <Modal openState={openState} onClose={onClose}>
      <div className="relative m-2 flex w-full max-w-xl transform flex-col overflow-hidden rounded-lg bg-white p-6 px-4 pt-5 pb-4 text-left shadow-xl transition-all">
        <div className="absolute top-0 right-0 hidden pt-4 pr-4">
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => openState[1](false)}
          >
            <span className="sr-only">{`Close`}</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 w-full grow overflow-y-scroll px-4">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
            <DocumentPlusIcon
              className="h-6 w-6 text-indigo-600"
              aria-hidden="true"
            />
          </div>
          <div className="h-full w-full grow pt-3 text-left">
            <h3 className="text-center font-medium leading-6 text-gray-900">
              {`Create a new hook`}
            </h3>
            <div className="my-5">
              <form onSubmit={(e) => void submitHandler(e)} id="form">
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
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="name"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="my_webhook"
                    {...register("name")}
                  />
                  <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    {`.json`}
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-5 px-4">
          <button
            type="submit"
            form="form"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-600/80"
            disabled={!isValid}
          >
            {`Create Hook`}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
