import clsx from "clsx";
import { FC } from "react";
import { MobileLogo } from "./icons";

interface NavigationProps {}

const Navigation: FC<NavigationProps> = () => {
  return (
    <div className="flex h-full flex-row items-center justify-between px-4">
      <div className="flex flex-row items-center">
        <MobileLogo className="h-6 w-6" />
        <div className="ml-4">
          <h1 className="text-lg font-bold leading-6">Platform Launch</h1>
        </div>
        <div className=" ml-2 flex items-center justify-center">
          <BoardSelectorPopover />
        </div>
      </div>
      <div className="flex flex-row items-center justify-center">
        <AddTaskButton />
        <BoardSettings />
      </div>
    </div>
  );
};

export default Navigation;

const BoardSelectorPopover: FC = () => {
  return (
    <>
      <svg
        className={clsx("h-2 w-4 stroke-current text-main-purple")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 7"
      >
        <path strokeWidth="2" fill="none" d="m1 1 4 4 4-4" />
      </svg>
      {/* <svg
        className={clsx("h-1 w-2")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 7"
      >
        <path strokeWidth="2" fill="none" d="M9 6 5 2 1 6" />
      </svg> */}
    </>
  );
};

interface AddTaskButtonProps {
  disabled?: boolean;
}
const AddTaskButton: FC<AddTaskButtonProps> = ({ disabled = false }) => {
  return (
    <button
      disabled={disabled}
      className="flex h-8 w-12 items-center justify-center rounded-3xl bg-main-purple disabled:bg-main-purple/25"
    >
      <svg
        className="h-3 w-3 fill-current text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 12"
      >
        <path d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z" />
      </svg>
    </button>
  );
};

const BoardSettings: FC = () => {
  return (
    <button className="ml-4 flex items-center justify-center">
      <svg
        className="h-4 w-1 fill-current text-medium-grey"
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
