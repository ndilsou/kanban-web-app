import { Popover, Switch, Transition } from "@headlessui/react";
import clsx from "clsx";
import { FC, Fragment, useEffect, useState } from "react";
import {
  BoardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DarkThemeIcon,
  LightThemeIcon,
  LogoDarkIcon,
  LogoLightIcon,
  MobileLogo,
} from "./icons";

interface NavigationProps {
  boards: string[];
  activeBoard: string;
  openMenu?: boolean;
}

const Navigation: FC<NavigationProps> = ({
  activeBoard,
  boards,
  openMenu = false,
}) => {
  return (
    <div className="flex h-16 flex-row items-center justify-between bg-white px-4 md:h-20 md:border-b md:pr-6 md:pl-0 lg:h-24 lg:pr-8">
      <div className="flex h-full flex-row items-center">
        <MainMenu open={openMenu} />
        {/* <SidebarMenu open={openMenu} /> */}
        <div className="ml-4 md:ml-6 lg:ml-8">
          <h2 className="hidden text-xl font-bold leading-6 md:block lg:text-2xl">
            {activeBoard}
          </h2>
          <div className="md:hidden">
            <BoardListbox activeBoard={activeBoard} boards={boards} />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center">
        <NewTaskButton />
        <BoardSettingsButton />
      </div>
    </div>
  );
};

export default Navigation;

interface BoardListboxProps {
  activeBoard: string;
  boards: string[];
}

const BoardListbox: FC<BoardListboxProps> = ({ activeBoard, boards }) => (
  <Popover className="relative">
    {({ open }) => (
      <>
        <Popover.Button className="flex flex-row items-center">
          <h2 className="text-lg font-bold leading-6">{activeBoard}</h2>
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
          <Popover.Panel className="fixed top-20 left-14 z-10  min-h-fit w-64 rounded-lg bg-white py-4 shadow-lg">
            <div className="pr-6">
              <BoardList boards={boards} active={activeBoard} />
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

interface BoardListProps {
  active: string;
  boards: string[];
}

const BoardList: FC<BoardListProps> = ({ active, boards }) => {
  return (
    <div className="flex flex-col">
      <h3 className="pl-6 text-xs font-bold uppercase tracking-[2.4px] text-medium-grey">
        All Boards ({boards.length})
      </h3>
      <ul className="mt-4 pl-6 text-md [&>li]:flex [&>li]:py-4 [&>li]:font-bold">
        {boards.map((name) => (
          <li
            key={name}
            className={clsx(
              name === active
                ? "-ml-6 rounded-r-full bg-main-purple pl-6 text-white"
                : "text-medium-grey"
            )}
          >
            <button className="flex">
              <BoardIcon className="h4 w-4 fill-current" />
              <h4 className="ml-3">{name}</h4>
            </button>
          </li>
        ))}
        <li className="text-main-purple">
          <BoardIcon className="h4 w-4 fill-current" />
          <h4 className="ml-3">+ Create New Board</h4>
        </li>
      </ul>
    </div>
  );
};

interface ThemeToggleProps {}

const ThemeToggle: FC<ThemeToggleProps> = () => {
  const [isDarkThemeEnabled, enableDarkTheme] = useState(false);
  // const theme = useContext(ThemeContext);

  useEffect(() => {
    if (isDarkThemeEnabled) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkThemeEnabled]);

  return (
    <div className="flex h-12 w-full items-center justify-center gap-6 rounded-md bg-light-grey">
      <LightThemeIcon className="h-5 w-5 fill-current text-medium-grey" />
      <Switch
        checked={isDarkThemeEnabled}
        onChange={enableDarkTheme}
        className={`relative inline-flex h-[19px] w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-main-purple transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Toggle Dark Theme</span>
        <span
          aria-hidden="true"
          className={`${
            isDarkThemeEnabled ? "translate-x-[22px]" : "translate-x-0"
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
}

const NewTaskButton: FC<NewTaskButtonProps> = ({ disabled = false }) => {
  return (
    <button
      disabled={disabled}
      className="flex h-8 w-12 items-center justify-center rounded-3xl bg-main-purple disabled:bg-main-purple/25 md:h-12 md:w-40"
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
  );
};

const BoardSettingsButton: FC = () => {
  return (
    <button className="ml-4 flex items-center justify-center md:ml-6">
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
    </button>
  );
};

interface MainLogoProps {
  open?: boolean;
}

const MainMenu: FC<MainLogoProps> = ({ open = false }) => {
  return (
    <>
      <div
        className={clsx(
          open ? "w-72 lg:w-75" : "w-52",
          "flex h-full  flex-row items-center transition-[width] delay-150 duration-300 ease-in-out md:border-r md:px-6 lg:px-8"
        )}
      >
        <MobileLogo className="h-6 w-6 md:hidden" />
        <LogoLightIcon className="hidden h-6 w-38 md:block" />
        <LogoDarkIcon className="hidden h-6 w-38 dark:md:block" />
      </div>
      <aside
        className={clsx(
          open
            ? "translate-x-0 -translate-y-px"
            : "-translate-x-72 lg:-translate-x-75",
          "fixed top-20 left-0 hidden h-full w-72 border-r bg-white transition-transform delay-150 duration-500 ease-in-out md:flex lg:w-75"
        )}
      ></aside>
    </>
  );
};
