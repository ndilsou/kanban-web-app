import Board, { Column } from "@kanban/components/board";
import Navigation from "@kanban/components/navigation";
import clsx from "clsx";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const Page: NextPage = () => {
  //   const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const columns: Column[] = [
    {
      name: "Todo",
      tasks: ["1", "2", "3", "4"],
    },
    {
      name: "Doing",
      tasks: Array(20)
        .fill(null)
        .map((_, i) => i.toString()),
    },
    {
      name: "Done",
      tasks: ["1", "2", "3", "4"],
    },
  ];
  const boards = ["Platform Launch", "Marketing Plan", "Roadmap"];
  const activeBoard = "Platform Launch";
  useEffect(() => {
    setTimeout(() => {
      setMenuIsOpen(true);
    }, 2000);
  });
  return (
    <div className="relative h-full w-full">
      <header className="h-fit bg-white">
        <Navigation
          activeBoard={activeBoard}
          boards={boards}
          openMenu={menuIsOpen}
        />
      </header>
      <main
        className={clsx(
          {
            "translate-x-72 lg:translate-x-75": menuIsOpen,
          },
          "h-full overflow-scroll transition-transform delay-150 duration-500 ease-in-out"
        )}
      >
        <Board columns={columns} />
      </main>
    </div>
  );
};

export default Page;
