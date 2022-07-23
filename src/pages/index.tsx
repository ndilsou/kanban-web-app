import { trpc } from "@kanban/utils/trpc";
import { NextPageWithLayout } from "@kanban/pages/_app";
import Layout from "@kanban/components/layout";
import { ReactElement } from "react";

const Home: NextPageWithLayout = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return <div className="">{hello.data?.greeting}</div>;
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
