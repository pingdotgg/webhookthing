import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CogIcon, FolderPlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";

import { cliApi } from "../utils/api";
import { Modal } from "./common/modal";

const formValidator = z.object({
  name: z.string().max(100).min(1, { message: "Required" }),
});

type FormValidatorType = z.infer<typeof formValidator>;

export const FolderFormModal = (input: {
  type: "create" | "update";
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  onClose?: () => void;
  path: string[];
}) => {
  const ctx = cliApi.useContext();

  const { data: existing } = cliApi.getFilesAndFolders.useQuery({
    path: input.path,
  });

  const { mutate: addFolder } = cliApi.createFolder.useMutation({
    onSuccess: () => {
      void ctx.getBlobs.invalidate().then(() => {
        void ctx.getFilesAndFolders.invalidate().then(() => {
          openState[1](false);
        });
      });
    },
  });

  const { type, openState, onClose } = input;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(formValidator),
    mode: "onBlur",
  });

  const onSubmit = (data: FormValidatorType) => {
    if (type === "create") {
      // Don't allow duplicate names (this overwrites the existing hook)
      if (existing?.folders.find((b) => b === data.name)) {
        return toast.error("Folder with that name already exists");
      }
      addFolder({
        name: data.name,
        path: input.path,
      });
    } else {
      // TODO: Implement update? (not needed for now)
    }
    reset();

    return "";
  };

  const submitHandler = handleSubmit(onSubmit);

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
              <FolderPlusIcon
                className="h-6 w-6 text-indigo-600"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="h-full w-full grow pt-3 text-left sm:ml-4 sm:pt-0">
            <h3 className="text-center font-medium leading-6 text-gray-900 sm:text-left">
              {type === "update" ? (
                <>{`Settings`}</>
              ) : (
                <>{`Create a new folder`}</>
              )}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {type === "update" ? (
                  <>{`Update your folder's settings below.`}</>
                ) : (
                  <>{`Give your folder a name below.`}</>
                )}
              </p>
            </div>
            <div className="mt-5">
              <form onSubmit={(e) => void submitHandler(e)} id="form">
                {type === "create" && (
                  <>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {`Name`}
                    </label>
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {(errors.name?.message ?? errors.name.type) as string}
                      </p>
                    )}
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        id="name"
                        className="block w-full min-w-0 flex-1 rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="my_new_folder"
                        {...register("name")}
                      />
                    </div>
                  </>
                )}
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
