import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export const Modal: React.FC<{
  children: React.ReactNode | React.ReactNode[];
  openState: [boolean, Dispatch<SetStateAction<boolean>>];
  initialFocus?: MutableRefObject<null>;
  onClose?: () => void;
}> & {
  Title: typeof Dialog.Title;
  Description: typeof Dialog.Description;
} = ({ openState, initialFocus, children, onClose }) => {
  const [open, setOpen] = openState;

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={initialFocus}
        onClose={handleClose}
      >
        <div className="flex h-full min-h-screen items-center justify-center text-center sm:p-0">
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
            // eslint-disable-next-line react/jsx-no-literals
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
            {children}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

Modal.Title = Dialog.Title;
Modal.Description = Dialog.Description;
