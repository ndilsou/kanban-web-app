import Board from "@kanban/components/board";
import { ShowSidebarIcon } from "@kanban/components/icons";
import Navigation from "@kanban/components/navigation";
import { appRouter } from "@kanban/server/router";
import { trpc } from "@kanban/utils/trpc";
import { createSSGHelpers } from "@trpc/react/ssg";
import clsx from "clsx";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import superjson from "superjson";
import { z } from "zod";
import { createContext } from "../../server/router/context";

interface PageProps {
  id: number;
}

const Page: NextPage<PageProps> = ({ id }) => {
  const getQuery = trpc.useQuery(["boards.get", { id }]);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  if (!getQuery.data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="relative h-full w-full  bg-light-grey dark:bg-very-dark-grey">
      <header className="h-fit bg-white dark:bg-dark-grey">
        <Navigation
          activeBoard={getQuery.data}
          openMenu={menuIsOpen}
          onHideSidebarClick={() => {
            setMenuIsOpen(false);
          }}
        />
      </header>
      <button
        className={clsx(
          "fixed left-0 top-[944px] hidden h-12 w-14 items-center rounded-r-full bg-main-purple hover:bg-hover-main-purple sm:flex",
          { "sm:hidden": menuIsOpen }
        )}
        onClick={() => {
          setMenuIsOpen(true);
        }}
      >
        <ShowSidebarIcon className="ml-4 h-3 w-4 fill-current text-white" />
      </button>
      <main
        className={clsx(
          {
            "w-[calc(100%-18rem)] translate-x-72 lg:w-[calc(100%-18.75rem)] lg:translate-x-75":
              menuIsOpen,
          },
          " h-full overflow-scroll transition-[width,transform] delay-150 duration-500 ease-in-out"
        )}
      >
        <Board boardId={getQuery.data.id} columns={getQuery.data.columns} />
      </main>
    </div>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const ctx = await createContext();
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx,
    transformer: superjson,
  });
  const rawId = z.string().parse(context.params?.id);
  const id = Number.parseInt(rawId);
  await Promise.all([
    ssg.fetchQuery("boards.get", { id }),
    ssg.fetchQuery("boards.list"),
  ]);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};
