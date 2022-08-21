import { Dialog } from "@headlessui/react";
import { FC } from "react";
import { getTaskCompletedCount, Task } from "@kanban/domain";

export interface ViewCardModalProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
}

export const ViewCardModal: FC<ViewCardModalProps> = ({
  open,
  task,
  onClose,
}) => {
  if (!task) {
    return <></>;
  }
  const completedCount = getTaskCompletedCount(task);
  const completionLabel = `Subtasks (${completedCount} of ${task.subtasks.length})`;
  return (
    <Dialog className="relative z-40" open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="z-50 w-full max-w-md rounded-lg bg-white p-6 dark:bg-dark-grey md:w-120 md:px-8 md:pt-8 md:pb-10">
          <Dialog.Title className="flex h-20 items-center justify-between">
            <span className="flex-grow text-start text-lg font-bold leading-6 text-black dark:text-white md:w-10/12">
              {task.title}
            </span>
            <span className="ml-4 flex h-full items-center">
              <svg
                className="h-4 w-1.5 fill-current text-medium-grey md:h-5 md:w-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 5 20"
              >
                <g fillRule="evenodd">
                  <circle cx="2.308" cy="2.308" r="2.308" />
                  <circle cx="2.308" cy="10" r="2.308" />
                  <circle cx="2.308" cy="17.692" r="2.308" />
                </g>
              </svg>
            </span>
          </Dialog.Title>
          <div className="mt-6 text-xs font-medium text-medium-grey">
            <div>
              <p className="leading-6">{task.description}</p>
            </div>
            <div className="mt-6">
              <h6 className="text-xs font-bold text-medium-grey">
                {completionLabel}
              </h6>
            </div>
            <div className="mt-6">
              <h6 className="text-xs font-bold text-medium-grey">
                Current Status
              </h6>
              <select className="form-select mt-2 w-full rounded-1 border border-[rgb(130,143,163)]/25"></select>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
