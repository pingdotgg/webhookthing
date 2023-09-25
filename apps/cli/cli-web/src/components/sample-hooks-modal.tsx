import { DocumentPlusIcon, XMarkIcon } from "@heroicons/react/20/solid";

import { cliApi } from "../utils/api";
import { Modal } from "./common/modal";
import { TestingFileTree, useSampleHooksStore } from "./filetree";

export const SampleHooksModal = (input: {
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  onClose?: () => void;
  path: string[];
}) => {
  const { openState, onClose } = input;

  const { selectedHooks } = useSampleHooksStore();
  const isValid = selectedHooks.length > 0;

  const ctx = cliApi.useContext();

  // 👺👺👺 non-pure, I was dumb and forgot react-hook-form existed while making the checkbox tree so its state is managed by zustand, could refactor to be pure by passing a `register` function to the tree and using react-hook-form's `useFieldArray` hook. I don't really see much value in it since the only validation we're doing is "is something selected at all?" - Igor
  const onSubmit = () => {
    /*
      TODO igor: 
      ↳ sort hooks by name
      ↳ loop through hooks
        ↳ check if something with the same name exists
          ↳ if it doesn't, create file for hook
          ↳ if it does, log a warning and skip 
            ↳  TODO later: if it does, run a loop to find a name that doesn't exist
    */

    console.log(selectedHooks);

    // Don't allow duplicate names (this overwrites the existing hook)
    // if (existing?.folders.find((b) => b === data.name)) {
    //   return toast.error("Folder with that name already exists");
    // }

    // createFile({
    //   name: data.name.trim(),
    //   path: input.path,
    // });
  };

  const submitHandler = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    onSubmit();
  };

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
              {`Select sample hooks to download`}
            </h3>
            <div className="my-5">
              <form onSubmit={(e) => void submitHandler(e)} id="form">
                {/* {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name?.message ?? errors.name.type}
                  </p>
                )} */}
                <TestingFileTree />
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
            {`Download hooks`}
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
