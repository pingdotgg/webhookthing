const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

const { withPlausibleProxy } = require("next-plausible");
module.exports = withPlausibleProxy()(withNextra());
