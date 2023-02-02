import withNextra from "nextra";

import { withPlausibleProxy } from "next-plausible";
export default withPlausibleProxy()(
  withNextra({
    theme: "nextra-theme-docs",
    themeConfig: "./theme.config.tsx",
  })()
);
