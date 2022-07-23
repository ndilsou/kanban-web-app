import clsx from "clsx";
import { FC, ReactNode } from "react";
import Navigation from "./navigation";

export interface SiteLayoutProps {
  className?: string;
  children: ReactNode;
}

const Layout: FC<SiteLayoutProps> = ({ className, children }) => {
  return (
    <div className={clsx(className, "h-full w-full ")}>
      <header className="h-16 bg-white">
        <Navigation />
      </header>
      <main className="h-full">{children}</main>
    </div>
  );
};

export default Layout;
