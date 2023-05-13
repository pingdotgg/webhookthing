import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FolderPlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { useLocation } from "wouter";

import { cliApi } from "../utils/api";
import { Modal } from "./common/modal";
import Button from "./common/button";

const formValidator = z.object({
  name: z.string().max(100).min(1, { message: "Required" }),
});

type FormValidatorType = z.infer<typeof formValidator>;

export const FolderFormModal = (input: {
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  prefill?: FormValidatorType;
  onClose?: () => void;
  path: string[];
}) => {
  const ctx = cliApi.useContext();
  const [, setLocation] = useLocation();

  const { data: existing } = cliApi.getFilesAndFolders.useQuery({
    path: input.path,
  });

  const { mutate: addFolder } = cliApi.createFolder.useMutation({
    onSuccess: async ({ route }) => {
      await ctx.parseUrl.invalidate();
      onClose && onClose();
      openState[1](false);
      reset();
      setLocation(route);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { openState, onClose, prefill } = input;
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
    addFolder({
      name: data.name.trim(),
      path: input.path,
    });
  };

  const submitHandler = handleSubmit(onSubmit);

  return (
    <Modal openState={openState} onClose={onClose}>
      <div className="relative m-2 flex w-full max-w-xl transform flex-col overflow-hidden rounded-lg bg-white p-6 px-4 pt-5 pb-4 text-left shadow-xl transition-all">
        <div className="absolute top-0 right-0 hidden pt-4 pr-4">
          <Button
            variant="text"
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => openState[1](false)}
          >
            <span className="sr-only">{`Close`}</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        <div className="min-h-0 w-full grow overflow-y-scroll px-4">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
            <FolderPlusIcon
              className="h-6 w-6 text-indigo-600"
              aria-hidden="true"
            />
          </div>
          <div className="h-full w-full grow pt-3 text-left">
            <h3 className="text-center font-medium leading-6 text-gray-900">
              {`Create a new folder`}
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
                    className="block w-full min-w-0 flex-1 rounded-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="my_new_folder"
                    {...register("name")}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-5 px-4">
          <Button
            type="submit"
            form="form"
            variant="indigo"
            size="lg"
            className="inline-flex w-full justify-center"
            disabled={!isValid}
          >
            {`Create Folder`}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="mt-3 inline-flex w-full justify-center"
            onClick={() => {
              openState[1](false);
            }}
          >
            {`Cancel`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
