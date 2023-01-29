import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  useNextSeoProps() {
    return {
      titleTemplate: "%s - webhookthing docs",
    };
  },

  logoLink: "https://webhooktool.com",
  logo: (
    <img
      src="/img/logo.svg"
      alt="webhookthing logo"
      style={{ height: "2rem" }}
    />
  ),
  chat: {
    link: "https://t3.gg/discord",
  },

  feedback: {
    content: null,
  },

  editLink: {
    text: null,
    component: null,
  },

  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="webhookthing docs" />
      <meta
        property="og:description"
        content="docs for webhookthing - a thing for webhooks"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
    </>
  ),

  footer: {
    component: null,
  },
};

export default config;
