// src/pages/_app.tsx
import type { AppRouter } from "@kanban/server/router";
import "@kanban/styles/globals.css";
import { withTRPC } from "@trpc/next";
import { NextComponentType, NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import { AppInitialProps, AppProps } from "next/app";
import { AppContextType, AppPropsType } from "next/dist/shared/lib/utils";
import type { AppType } from "next/dist/shared/lib/utils";
import { ReactElement, ReactNode } from "react";
import superjson from "superjson";
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function hasLayout(Component: NextPage): Component is NextPageWithLayout {
  return typeof (Component as NextPageWithLayout).getLayout !== "undefined";
}

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  let getLayout: NextPageWithLayout["getLayout"] = (page) => page;
  if (hasLayout(Component)) {
    getLayout = Component.getLayout;
  }
  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
