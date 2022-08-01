import clsx from "clsx";
import { FC, ReactNode } from "react";
import Navigation from "./navigation";

export interface SiteLayoutProps {
  className?: string;
  children: ReactNode;
}

const Layout: FC<SiteLayoutProps> = ({ className, children }) => {
  return (
    <div className={clsx(className, "h-full w-full")}>
      <header className="h-fit bg-white">{/* <Navigation /> */}</header>
      <aside></aside>
      <main className="h-full overflow-scroll">{children}</main>
    </div>
  );
};

export default Layout;
