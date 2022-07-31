import { FC } from "react";

export type Column = { name: string; tasks: string[] };

export interface BoardProps {
  columns: Column[];
}

const Board: FC<BoardProps> = ({ columns }) => {
  return (
    <>
      {columns.length > 0 ? (
        <div className="h-full w-full overflow-scroll">
          <div className="flex  min-h-max w-fit justify-center gap-6 px-4 pt-6 pb-12 md:px-6">
            {columns.map((data) => (
              <Column key={data.name} data={data} />
            ))}
            <AddNewColumn />
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <EmptyBoardWidget />
        </div>
      )}
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
    <button className="mt-10 h-[814px] w-72 rounded-md bg-lines-light">
      <span className="text-center text-2xl font-bold text-medium-grey">
        + New Column
      </span>
    </button>
  );
};

interface ColumnProps {
  data: { name: string; tasks: string[] };
}

/** Column is a Kanban Board column containing cards */
const Column: FC<ColumnProps> = ({ data }) => {
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
          <Card key={task} />
        ))}
      </div>
    </div>
  );
};

interface CardProps {}

const Card: FC<CardProps> = () => {
  return (
    <button className="flex h-20 w-72 flex-col items-start justify-center rounded-lg bg-white px-4 text-left font-bold shadow-lg">
      <h5 className=" text-md  text-black">Build UI for onboarding flow</h5>
      <span className="mt-2 text-xs text-medium-grey">0 of 3 substacks</span>
    </button>
  );
};
