// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

import type { Session } from "next-auth";
import type { AppProps, AppType } from "next/app";
import type { NextPage } from "next/types";

import { trpc } from "../utils/trpc";
import { ModalContainer } from "../components/common/modal";
import { getAppLayout, LayoutFn } from "../components/layout/app-layout";

type NextPageWithLayout = NextPage & { getLayout?: LayoutFn };
type AppPropsWithLayout = AppProps & {
  session: Session | null;
  Component: NextPageWithLayout;
};

function AppCore({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? getAppLayout;
  return (
    <>
      <ModalContainer />
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

function AppWrapper(props: AppPropsWithLayout) {
  return (
    <SessionProvider session={props.session}>
      <AppCore {...props} />
    </SessionProvider>
  );
}

export default trpc.withTRPC(AppWrapper);
