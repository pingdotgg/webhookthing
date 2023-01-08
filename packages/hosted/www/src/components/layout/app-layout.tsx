import classNames from "classnames";
import type { ReactNode } from "react";
import TopNav from "./navigation";

export const APP_LAYOUT_CLASSES =
  "mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8";

export type LayoutFn = (page: React.ReactElement) => React.ReactNode;

export const AppLayout: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <AppWrapper>
      <TopNav />
      <main className={APP_LAYOUT_CLASSES} key="app">
        {children}
      </main>
    </AppWrapper>
  );
};

export const AppWrapper: React.FC<{
  className?: string;
  children?: ReactNode;
}> = ({ children, className }) => {
  return (
    <div className={classNames("min-h-screen", className)}>{children}</div>
  );
};

export const getAppLayout: LayoutFn = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export const NoLayout: LayoutFn = (page) => page;
