import { Dialog } from "@headlessui/react";
import { FC, ReactNode } from "react";

export interface DeleteModalProps {
  open: boolean;
  title: string;
  onDelete?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  children: ReactNode;
}

export const DeleteModal: FC<DeleteModalProps> = ({
  title,
  children,
  open,
  onDelete,
  onCancel,
  onClose,
}) => {
  return (
    <Dialog className="relative z-40" open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="z-50 w-full max-w-md rounded-lg bg-white p-6 dark:bg-dark-grey sm:w-120 sm:max-w-none sm:px-8 sm:pt-8 sm:pb-10 lg:max-w-lg">
          <Dialog.Title className="text-start font-bold text-red">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-6 text-xs text-medium-grey">
            {children}
          </Dialog.Description>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              className="flex h-10 w-full items-center justify-center rounded-2.5xl bg-red text-center text-xs font-bold text-white hover:bg-hover-red md:w-50"
              onClick={onDelete}
            >
              Delete
            </button>
            <button
              className="flex h-10 w-full items-center justify-center rounded-2.5xl  bg-[#635FC7]/10 text-center text-xs font-bold text-main-purple hover:bg-[#635FC7]/25 dark:bg-white dark:text-main-purple md:w-50"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
