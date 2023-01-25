/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["next", "prettier", "eslint:recommended"],
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/recommended",
        'plugin:@next/next/recommended',
      ],
      files: ["**/*.ts", "**/*.tsx"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
          "./tsconfig.json",
          "./apps/**/*/tsconfig.json",
          "./packages/**/*/tsconfig.json",
        ],
      },
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/no-floating-promises": "error",
      },
    },
  ],
  root: true,
  reportUnusedDisableDirectives: true,
  ignorePatterns: [
    ".eslintrc.js",
    "**/*.config.js",
    "**/*.config.cjs",
    "packages/config/**",
  ],
};

module.exports = config;
