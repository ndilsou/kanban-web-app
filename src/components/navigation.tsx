import { Menu, Popover, Switch, Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { FC, Fragment, useContext, useState } from "react";
import { Board } from "../domain";
import { trpc } from "../utils/trpc";
import { ThemeContext } from "./contexts";
import {
  BoardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DarkThemeIcon,
  HideSidebarIcon,
  LightThemeIcon,
  LogoDarkIcon,
  LogoLightIcon,
  MobileLogo
} from "./icons";
import {
  BoardMutationModal,
  DeleteModal,
  TaskMutationFormValues,
  TaskMutationModal
} from "./modals";

interface NavigationProps {
  activeBoard: Board;
  openMenu?: boolean;
  onHideSidebarClick?: () => void;
}

const Navigation: FC<NavigationProps> = ({
  activeBoard,
  openMenu = false,
  onHideSidebarClick,
}) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const listQuery = trpc.useQuery(["boards.list"]);
  const handleAddNewBoardClick = () => setModalIsVisible(true);
  const createBoard = trpc.useMutation("boards.create");

  if (!listQuery.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex h-16 flex-row items-center justify-between border-lines-light bg-white px-4 dark:border-lines-dark dark:bg-dark-grey md:h-20 md:border-b md:pr-6 md:pl-0 lg:h-24 lg:pr-8">
        <div className="flex h-full flex-row items-center">
          <MainMenu
            activeBoard={activeBoard.name}
            boards={listQuery.data}
            open={openMenu}
            onHideSidebarClick={onHideSidebarClick}
            onAddNewBoardClick={handleAddNewBoardClick}
          />
          <div className="ml-4 md:ml-6 lg:ml-8">
            <h2 className="hidden text-xl font-bold leading-6 dark:text-white md:block lg:text-2xl">
              {activeBoard.name}
            </h2>
            <div className="md:hidden">
              <BoardListbox
                onAddNewBoardClick={handleAddNewBoardClick}
                activeBoard={activeBoard.name}
                boards={listQuery.data}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center">
          <NewTaskButton
            statuses={activeBoard.columns.map(({ id, name }) => ({ id, name }))}
          />
          <BoardSettingsButton board={activeBoard} />
        </div>
      </div>
      <BoardMutationModal
        open={modalIsVisible}
        title="Add New Board"
        name=""
        columns={["Todo", "Doing"]}
        submitButtonLabel="Create New Board"
        onSubmit={(data) => {
          console.log(data);
        }}
        onClose={() => {
          setModalIsVisible(false);
        }}
      />
    </>
  );
};

export default Navigation;

interface BoardListboxProps {
  activeBoard: string;
  boards: BoardListItem[];
  onAddNewBoardClick: () => void;
}

const BoardListbox: FC<BoardListboxProps> = ({
  activeBoard,
  boards,
  onAddNewBoardClick,
}) => (
  <Popover className="relative">
    {({ open, close }) => (
      <>
        <Popover.Button className="flex flex-row items-center">
          <h2 className="text-lg font-bold leading-6 dark:text-white">
            {activeBoard}
          </h2>
          <div className="ml-2 flex items-center justify-center">
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </div>
        </Popover.Button>
        <Popover.Overlay className="fixed top-16 left-0 right-0 bottom-0 bg-black opacity-30" />
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="fixed top-20 left-14 z-10  min-h-fit w-64 rounded-lg bg-white py-4 shadow-lg dark:bg-dark-grey">
            <div className="pr-6">
              <BoardList
                boards={boards}
                activeBoard={activeBoard}
                onAddNewBoardClick={onAddNewBoardClick}
                onClick={() => {
                  close();
                }}
              />
            </div>
            <div className="mt-4 px-4">
              <ThemeToggle />
            </div>
          </Popover.Panel>
        </Transition>
      </>
    )}
  </Popover>
);

type BoardListItem = {
  name: string;
  id: number;
};

interface BoardListProps {
  activeBoard: string;
  boards: BoardListItem[];
  onClick?: () => void;
  onAddNewBoardClick?: () => void;
}

const BoardList: FC<BoardListProps> = ({
  activeBoard: active,
  boards,
  onAddNewBoardClick,
  onClick,
}) => {
  return (
    <>
      <div className="flex flex-col">
        <h3 className="pl-6 text-xs font-bold uppercase tracking-[2.4px] text-medium-grey">
          All Boards ({boards.length})
        </h3>
        <ul className="mt-4 pl-6 text-md [&>li]:flex [&>li]:py-4 [&>li]:font-bold">
          {boards.map(({ name, id }) => (
            <li
              key={name}
              className={clsx(
                "-ml-6 rounded-r-full pl-6",
                name === active
                  ? " bg-main-purple text-white"
                  : "dark:hover-white text-medium-grey hover:bg-main-purple/10 hover:text-main-purple dark:hover:bg-white"
              )}
            >
              <Link href={`/boards/${id}`}>
                <a className="flex" onClick={onClick}>
                  <BoardIcon className="h4 w-4 fill-current" />
                  <h4 className="ml-3">{name}</h4>
                </a>
              </Link>
            </li>
          ))}
          <li className="text-main-purple">
            <button className="flex items-center" onClick={onAddNewBoardClick}>
              <BoardIcon className="h4 w-4 fill-current" />
              <h4 className="ml-3">+ Create New Board</h4>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

interface ThemeToggleProps {}

const ThemeToggle: FC<ThemeToggleProps> = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="flex h-12 w-full items-center justify-center gap-6 rounded-md bg-light-grey dark:bg-very-dark-grey">
      <LightThemeIcon className="h-5 w-5 fill-current text-medium-grey" />
      <Switch
        checked={theme === "dark"}
        onChange={toggleTheme}
        className={`relative inline-flex h-[19px] w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-main-purple transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Toggle Dark Theme</span>
        <span
          aria-hidden="true"
          className={`${
            theme === "dark" ? "translate-x-[22px]" : "translate-x-0"
          }
            pointer-events-none my-auto inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
      <DarkThemeIcon className="h-5 w-5 fill-current text-medium-grey" />
    </div>
  );
};

interface NewTaskButtonProps {
  disabled?: boolean;
  statuses: { id: number; name: string }[];
}

const NewTaskButton: FC<NewTaskButtonProps> = ({
  disabled = false,
  statuses,
}) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const trpcCtx = trpc.useContext();
  const createTask = trpc.useMutation("boards.createTask", {
    onSuccess: () => {
      trpcCtx.invalidateQueries("boards.get");
    },
  });
  function handleTaskCreate({ subtasks, ...task }: TaskMutationFormValues) {
    createTask.mutate({
      task: {
        ...task,
        subtasks: subtasks.map(({ name }) => ({
          title: name,
          isCompleted: false,
        })),
      },
    });
    setModalIsVisible(false);
  }
  return (
    <>
      <button
        disabled={disabled}
        className="flex h-8 w-12 items-center justify-center rounded-3xl bg-main-purple hover:bg-hover-main-purple disabled:bg-main-purple/25 md:h-12 md:w-40"
        onClick={() => setModalIsVisible(true)}
      >
        <svg
          className="h-3 w-3 fill-current text-white md:hidden"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 12 12"
        >
          <path d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z" />
        </svg>

        <h4 className="hidden text-md font-bold text-white md:block">
          + Add New Task
        </h4>
      </button>
      <TaskMutationModal
        statuses={statuses}
        onSubmit={handleTaskCreate}
        title="Add New Task"
        submitButtonLabel="Add Task"
        open={modalIsVisible}
        onClose={() => setModalIsVisible(false)}
      />
    </>
  );
};

interface BoardSettingsButtonProps {
  board: Board;
}

const BoardSettingsButton: FC<BoardSettingsButtonProps> = ({ board }) => {
  const [editModalIsOpen, setEditModalOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalOpen] = useState(false);
  const ctx = trpc.useContext();
  const mutation = trpc.useMutation(["boards.delete"], {
    onSuccess: () => {
      ctx.invalidateQueries(["boards.get", { id: board.id }]);
      ctx.invalidateQueries(["boards.list"]);
    },
  });
  function handleBoardDelete() {
    mutation.mutate({ id: board.id });
    setDeleteModalOpen(false);
  }
  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="ml-4 flex items-center justify-center md:ml-6">
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
        <Menu.Items className="absolute right-0 top-12 flex h-24 w-48 flex-col items-start justify-around gap-4 rounded-lg bg-white p-4 text-xs font-medium shadow-md dark:bg-very-dark-grey dark:shadow-black/20">
          <Menu.Item
            as="button"
            className="p-2 text-medium-grey"
            onClick={() => {
              setEditModalOpen(true);
            }}
          >
            Edit Board
          </Menu.Item>
          <Menu.Item
            as="button"
            className="p-2 text-red"
            onClick={() => {
              setDeleteModalOpen(true);
            }}
          >
            Delete Board
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <BoardMutationModal
        open={editModalIsOpen}
        title="Edit Board"
        name={board.name}
        columns={board.columns.map((c) => c.name)}
        submitButtonLabel="Save Changes"
        onSubmit={(data) => {
          console.log(data);
        }}
        onClose={() => {
          setEditModalOpen(false);
        }}
      />
      <DeleteModal
        title="Delete this board?"
        open={deleteModalIsOpen}
        onDelete={handleBoardDelete}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
      >
        {`Are you sure you want to delete the '${board.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
      </DeleteModal>
    </>
  );
};

interface MainLogoProps {
  activeBoard: string;
  boards: BoardListItem[];
  open?: boolean;
  onHideSidebarClick?: () => void;
  onAddNewBoardClick?: () => void;
}

const MainMenu: FC<MainLogoProps> = ({
  activeBoard: activeBoard,
  boards,
  open = false,
  onHideSidebarClick,
  onAddNewBoardClick,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div
        className={clsx(
          open ? "w-72 lg:w-75" : "md:w-52",
          "flex h-full  flex-row items-center border-lines-light transition-[width] delay-150 duration-300 ease-in-out dark:border-lines-dark md:border-r md:px-6 lg:px-8"
        )}
      >
        <MobileLogo className="h-6 w-6 md:hidden" />
        {theme === "light" ? (
          <LogoLightIcon className="hidden h-6 w-38 md:block" />
        ) : (
          <LogoDarkIcon className="hidden h-6 w-38 dark:md:block" />
        )}
      </div>
      <aside
        className={clsx(
          open
            ? "translate-x-0 -translate-y-px"
            : "-translate-x-72 lg:-translate-x-75",
          "fixed top-20 left-0 hidden h-full w-72 border-r border-lines-light bg-white transition-transform delay-150 duration-500 ease-in-out dark:border-lines-dark dark:bg-dark-grey md:block lg:top-24 lg:w-75"
        )}
      >
        <div className="relative mt-8 flex h-full flex-col">
          <div className="pr-5">
            <BoardList
              activeBoard={activeBoard}
              boards={boards}
              onAddNewBoardClick={onAddNewBoardClick}
            />
          </div>
          <div className="fixed top-[786px] w-full px-3 lg:top-[792px] lg:px-6">
            <ThemeToggle />
          </div>
          <button
            className="fixed top-[848px] left-0  flex h-12 w-72 items-center rounded-r-full align-middle text-medium-grey hover:bg-main-purple/10  hover:text-main-purple dark:hover:bg-white"
            onClick={onHideSidebarClick}
          >
            <HideSidebarIcon className="h-3 w-4 fill-current md:ml-6 lg:ml-8" />
            <span className="ml-4 text-md font-bold">Hide Sidebar</span>
          </button>
        </div>
      </aside>
    </>
  );
};
