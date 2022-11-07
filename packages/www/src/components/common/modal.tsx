import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import create from "zustand";

export const Modal: React.FC<{
  openState: [boolean, Dispatch<SetStateAction<boolean>>];
  initialFocus?: MutableRefObject<null>;
  children: React.ReactNode;
}> & {
  Title: typeof Dialog.Title;
  Description: typeof Dialog.Description;
} = ({ openState, initialFocus, children }) => {
  const [open, setOpen] = openState;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={initialFocus}
        onClose={setOpen}
      >
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900/75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block text-left align-bottom sm:align-middle">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

Modal.Title = Dialog.Title;
Modal.Description = Dialog.Description;

interface ModalStoreState {
  content?: JSX.Element;
  setContent: (content?: JSX.Element) => void;
}

type ConfirmationModalOptions = {
  title: string;
  description: string;
  confirmationLabel?: string;
  onConfirm?: () => void;
  icon?: ReactNode;
  variant?: "primary" | "danger";
};

const useModalStore = create<ModalStoreState>((set) => ({
  content: undefined,
  setContent: (content) => set({ content }),
}));

export const useConfirmationModal = (options: ConfirmationModalOptions) => {
  const setContent = useModalStore((s) => s.setContent);
  const { onConfirm, ...rest } = options;
  const trigger = () => {
    setContent(
      <ConfirmationModal
        onConfirm={() => {
          onConfirm?.();
          setContent(undefined);
        }}
        onCancel={() => setContent(undefined)}
        {...rest}
      />
    );
  };
  return trigger;
};

export const ModalContainer: React.FC = () => {
  const [content, setContent] = useModalStore((s) => [s.content, s.setContent]);
  return (
    <Modal openState={[!!content, (open) => !open && setContent(undefined)]}>
      {content}
    </Modal>
  );
};

const ConfirmationModal: React.FC<
  ConfirmationModalOptions & {
    onCancel?: () => void;
  }
> = ({
  title,
  description,
  confirmationLabel = "Okay",
  onConfirm,
  onCancel,
  icon,
  variant = "primary",
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!cancelButtonRef.current) return;
    cancelButtonRef.current.focus();
  }, []);
  return (
    <div className="descriptionoverflow-hidden rounded-lg border bg-white px-4 pt-5 pb-4 shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        {icon && (
          <div
            className={classNames(
              "mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border sm:mx-0 sm:h-10 sm:w-10",
              {
                "border-gray-700 bg-gray-600": variant === "primary",
                "border-red-700 bg-red-600": variant === "danger",
              }
            )}
          >
            <div
              className="relative top-[-0.01rem]" // Icon isn't centered in it's frame
              aria-hidden="true"
            >
              {icon}
            </div>
          </div>
        )}
        <div className="text-center sm:text-left">
          <Modal.Title as="h3" className="text-lg font-medium leading-6">
            {title}
          </Modal.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:mt-4 sm:flex-row-reverse">
        <button
          className={classNames(
            "inline-flex w-full items-center justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-white shadow-sm  focus:outline-none focus:ring-2  focus:ring-offset-2 sm:w-auto sm:text-sm",
            {
              "border-red-700 bg-red-600 hover:bg-red-700 focus:ring-red-500":
                variant === "danger",
              "border-indigo-700 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500":
                variant === "primary",
            }
          )}
          onClick={onConfirm}
        >
          {confirmationLabel}
        </button>
        <button
          className="w-full justify-center sm:w-auto sm:text-sm"
          onClick={onCancel}
          ref={cancelButtonRef}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
