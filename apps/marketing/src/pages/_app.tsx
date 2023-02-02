import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import PlausibleProvider from "next-plausible";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PlausibleProvider domain="webhookthing.com">
      <Component {...pageProps} />
    </PlausibleProvider>
  );
};

export default api.withTRPC(MyApp);
