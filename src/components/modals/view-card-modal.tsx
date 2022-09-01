import { Dialog, Menu } from "@headlessui/react";
import { FC } from "react";
import { getTaskCompletedCount, Task } from "@kanban/domain";
import { trpc } from "../../utils/trpc";
import clsx from "clsx";

export interface ViewCardModalProps {
  open: boolean;
  taskId: number;
  statuses: { id: number; name: string }[];
  onClose: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export const ViewCardModal: FC<ViewCardModalProps> = ({
  open,
  taskId: id,
  statuses,
  onClose,
  onEditClick,
  onDeleteClick,
}) => {
  const ctx = trpc.useContext();
  const getTask = trpc.useQuery(["boards.getTask", { id }]);
  const moveTask = trpc.useMutation("boards.moveTask");
  const toggleSubtask = trpc.useMutation("boards.tasks.toggleSubtask");
  if (!getTask.data) {
    return <>Loading...</>;
  }

  const task = getTask.data;
  const completedCount = getTaskCompletedCount(task);
  const completionLabel = `Subtasks (${completedCount} of ${task.subtasks.length})`;
  return (
    <>
      <Dialog className="relative z-40" open={open} onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Dialog.Panel className="z-50 w-full max-w-md rounded-lg bg-white p-6 dark:bg-dark-grey md:w-120 md:px-8 md:pt-8 md:pb-10">
            <Dialog.Title className="flex h-20 items-center justify-between">
              <span className="flex-grow text-start text-lg font-bold leading-6 text-black dark:text-white md:w-10/12">
                {task.title}
              </span>
              <TaskMenuButton
                onDeleteClick={onDeleteClick}
                onEditClick={onEditClick}
              />
            </Dialog.Title>
            <div className="mt-6 text-xs font-medium text-medium-grey">
              <div>
                <p className="leading-6">{task.description}</p>
              </div>
              <div className="mt-6">
                <h6 className="text-xs font-bold text-medium-grey">
                  {completionLabel}
                </h6>
                <ol className="mt-4 flex flex-col gap-2">
                  {task.subtasks.map((st) => (
                    <li
                      key={st.id}
                      className="flex h-16 w-full list-none items-center rounded-1 bg-light-grey pl-4 pr-2 dark:bg-very-dark-grey"
                    >
                      <input
                        type="checkbox"
                        id={st.id.toString()}
                        className="rounded-sm"
                        checked={st.isCompleted}
                        onChange={() => {
                          st.isCompleted = !st.isCompleted;
                          toggleSubtask.mutate(
                            { id: st.id, isCompleted: st.isCompleted },
                            {
                              onSuccess: () => {
                                ctx.invalidateQueries(["boards.get"], {
                                  predicate: (query) => {
                                    return query.queryKey[0] === "boards.get";
                                  },
                                });
                                ctx.invalidateQueries([
                                  "boards.getTask",
                                  { id: st.taskId },
                                ]);
                              },
                            }
                          );
                        }}
                      />
                      <span
                        className={clsx(
                          {
                            "line-through opacity-50": st.isCompleted,
                          },
                          "ml-4 text-xs font-bold text-black dark:text-white"
                        )}
                      >
                        {st.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-6">
                <h6 className="text-xs font-bold text-medium-grey">
                  Current Status
                </h6>
                <select
                  value={task.columnId}
                  className="form-select mt-2 w-full rounded-1 border border-[rgb(130,143,163)]/25 bg-inherit text-black dark:text-white"
                  onChange={(ev) => {
                    const columnId = parseInt(ev.target.value);
                    moveTask.mutate(
                      { id: task.id, columnId },
                      {
                        onSuccess: () => {
                          ctx.invalidateQueries(["boards.get"], {
                            predicate: (query) => {
                              return query.queryKey[0] === "boards.get";
                            },
                          });
                          ctx.invalidateQueries([
                            "boards.getTask",
                            { id: task.id },
                          ]);
                        },
                      }
                    );
                  }}
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

interface TaskMenuButtonProps {
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

const TaskMenuButton: FC<TaskMenuButtonProps> = ({
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="ml-4 flex items-center justify-center p-2 md:ml-6">
          <svg
            className="h-4 w-1 fill-current text-medium-grey md:h-5 md:w-1.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 5 20"
          >
            <g fillRule="evenodd">
              <circle cx="2.308" cy="2.308" r="2.308" />
              <circle cx="2.308" cy="10" r="2.308" />
              <circle cx="2.308" cy="17.692" r="2.308" />
            </g>
          </svg>
        </Menu.Button>
        <Menu.Items className="absolute top-12 flex h-24 w-48 -translate-x-1/3 flex-col items-start justify-around gap-4 rounded-lg bg-white p-4 text-xs font-medium shadow-md dark:bg-very-dark-grey dark:shadow-black/20">
          <Menu.Item
            as="button"
            className="p-2 text-medium-grey"
            onClick={onEditClick}
          >
            Edit Task
          </Menu.Item>
          <Menu.Item
            as="button"
            className="p-2 text-red"
            onClick={onDeleteClick}
          >
            Delete Task
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </>
  );
};
