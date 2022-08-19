import { Dialog } from "@headlessui/react";
import { FC } from "react";
import { Task } from "@kanban/domain";

export interface ViewCardModalProps {
  open: boolean;
  task: Task;
  onClose: () => void;
}

export const ViewCardModal: FC<ViewCardModalProps> = ({
  open,
  task,
  onClose,
}) => {
  const completionLabel = "Subtasks (2 of 3)";
  return (
    <Dialog className="relative z-40" open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="z-50 w-full max-w-md rounded-lg bg-white p-6 dark:bg-dark-grey md:w-120 md:px-8 md:pt-8 md:pb-10">
          <Dialog.Title className="text-start text-lg font-bold text-black dark:text-white">
            {task.title}
          </Dialog.Title>
          <div className="mt-6 text-xs font-medium text-medium-grey">
            <p>{task.description}</p>
            <div className="mt-6">
              <h6 className="text-xs font-bold text-medium-grey">
                {completionLabel}
              </h6>
            </div>
            <div className="mt-6">
              <h6 className="text-xs font-bold text-medium-grey">
                Current Status
              </h6>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
