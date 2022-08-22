import { Dialog } from "@headlessui/react";
import { FC, useCallback, useState } from "react";
import {
  Column as ColumnData,
  getTaskCompletedCount,
  Task,
} from "@kanban/domain";
import {
  DeleteModal,
  TaskMutationFormValues,
  TaskMutationModal,
  ViewCardModal,
} from "./modals";
import { trpc } from "../utils/trpc";
import { SubmitHandler } from "react-hook-form";

export interface BoardProps {
  boardId: number;
  columns: ColumnData[];
}

type TaskFragment = { id: number; title: string };

const Board: FC<BoardProps> = ({ boardId, columns }) => {
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskFragment | null>(null);

  const deleteTask = trpc.useMutation("boards.deleteTask", {
    onSuccess: () => {
      const ctx = trpc.useContext();
      ctx.invalidateQueries(["boards.get", { id: boardId }]);
    },
  });
  function handleCardClick(task: Task) {
    setActiveTask({ id: task.id, title: task.title });
    setIsViewModalVisible(true);
  }

  const updateTask = trpc.useMutation("boards.updateTask");
  function handleTaskEditSubmission({
    subtasks,
    ...task
  }: TaskMutationFormValues) {
    // updateTask.mutate({
    //   task: { ...task, subtasks: subtasks.map((st) => ({ title: st.name })) },
    // });
    setIsEditModalVisible(false);
  }

  function handleDeleteTask() {
    if (activeTask === null) return;
    deleteTask.mutate({ id: activeTask.id });
    setIsDeleteModalVisible(false);
  }

  const statuses = columns.map(({ id, name }) => ({ id, name }));
  return (
    <>
      {columns.length > 0 ? (
        <div className="inline h-full w-full overflow-scroll">
          <div className="flex min-h-max w-fit justify-center gap-6 px-4 pt-6 pb-12 md:px-6">
            {columns.map((col) => (
              <Column key={col.name} data={col} onCardClick={handleCardClick} />
            ))}
            <AddNewColumn />
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <EmptyBoardWidget />
        </div>
      )}
      {activeTask !== null ? (
        <>
          <ViewCardModal
            open={isViewModalVisible}
            taskId={activeTask.id}
            statuses={statuses}
            onClose={() => setIsViewModalVisible(false)}
            onDeleteClick={() => {
              setIsViewModalVisible(false);
              setIsDeleteModalVisible(true);
            }}
            onEditClick={() => {
              setIsViewModalVisible(false);
              setIsEditModalVisible(true);
            }}
          />
          <TaskEditModal
            taskId={activeTask.id}
            statuses={statuses}
            open={isEditModalVisible}
            onClose={() => setIsEditModalVisible(false)}
            onSubmit={handleTaskEditSubmission}
          />
          <DeleteModal
            title="Delete this task?"
            open={isDeleteModalVisible}
            onDelete={handleDeleteTask}
            onClose={() => {
              setIsDeleteModalVisible(false);
            }}
          >
            {`Are you sure you want to delete the '${activeTask.title}' task and its subtasks? This action cannot be reversed.`}
          </DeleteModal>
        </>
      ) : null}
    </>
  );
};

export default Board;

const EmptyBoardWidget: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="max-w-[343px] text-center text-lg font-bold leading-6 text-medium-grey md:max-w-[369px] lg:max-w-none">
        This board is empty. Create a new column to get started.
      </h3>
      <button className="mt-6 flex h-12 w-44 items-center justify-center rounded-3xl bg-main-purple text-md font-bold text-white">
        + Add New Column
      </button>
    </div>
  );
};

const AddNewColumn: FC = () => {
  return (
    <button className="mt-10 h-[814px] w-72 rounded-md bg-lines-light dark:bg-inherit dark:bg-dark-gradient">
      <span className="text-center text-2xl font-bold text-medium-grey hover:text-main-purple">
        + New Column
      </span>
    </button>
  );
};

interface ColumnProps {
  data: ColumnData;
  onCardClick?: (task: Task) => void;
}

/** Column is a Kanban Board column containing cards */
const Column: FC<ColumnProps> = ({ data, onCardClick }) => {
  return (
    <div className="flex h-max w-72 flex-col">
      <div className="flex items-center justify-start">
        <svg
          className="-ml-0.5 h-4 w-4 fill-current text-[#49C4E5]"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="50" />
        </svg>
        <h3 className="ml-3 text-xs font-bold uppercase text-medium-grey">
          {data.name} ({data.tasks.length})
        </h3>
      </div>
      <div className="mt-5 grid h-fit grid-cols-1 gap-5">
        {data.tasks.map((task) => (
          <Card key={task.title} task={task} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
};

interface CardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

const Card: FC<CardProps> = ({ task, onClick }) => {
  const completedCount = getTaskCompletedCount(task);
  const summary = `${completedCount} of ${task.subtasks.length} substacks`;
  function handleClick() {
    if (onClick) {
      onClick(task);
    }
  }
  return (
    <button
      className="group flex w-72 flex-col items-start justify-center rounded-lg bg-white px-4 py-6 text-left font-bold shadow-lg dark:bg-dark-grey"
      onClick={handleClick}
    >
      <h5 className=" text-md  text-black group-hover:text-main-purple dark:text-white">
        {task.title}
      </h5>
      <span className="mt-2 text-xs text-medium-grey">{summary}</span>
    </button>
  );
};

interface TaskEditModalProps {
  taskId: number;
  statuses: { id: number; name: string }[];
  open: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<TaskMutationFormValues>;
}
function TaskEditModal({
  taskId,
  statuses,
  open,
  onClose,
  onSubmit,
}: TaskEditModalProps) {
  const query = trpc.useQuery(["boards.getTask", { id: taskId }]);
  if (!query.data) {
    return <>Loading...</>;
  }
  return (
    <TaskMutationModal
      title="Edit Task"
      statuses={statuses}
      task={query.data}
      open={open}
      onClose={onClose}
      submitButtonLabel="Save Changes"
      onSubmit={onSubmit}
    />
  );
}
