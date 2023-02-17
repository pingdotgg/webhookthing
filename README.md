# Captain

Monorepo for [webhookthing](https://webhookthing.com)

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

## Getting Started

```bash
pnpm install
pnpm dev
```

### For just cli

```bash
pnpm dev-cli
```

[downloads-image]: https://img.shields.io/npm/dm/webhookthing?color=364fc7&logoColor=364fc7
[npm-url]: https://www.npmjs.com/package/webhookthing
[npm-image]: https://img.shields.io/npm/v/webhookthing?color=0b7285&logoColor=0b7285

## Publishing Instructions

First, add changes with changesets:

```bash
npx changeset add
```

Then, make a new version & publish

```bash
pnpm publish-cli
```

## Making a new package

This is half a guide half our "lessons learned" from doing this too many times.

[Example PR where we added the logger package](https://github.com/pingdotgg/captain/pull/75)

1. Create a new folder in either `packages/` or `apps/`
   a. Generally we recommend putting things in `packages/` if they'll be used in >1 thing in `apps/`
2. Create a package.json that imports the shared eslint and tsconfig
   a. Probably easiest to copy-paste a minimal package at this point, `@captain/logger` is a good one
3. Add the new package's path to all the weird places it needs to be listed
   a. `pnpm-workspace.yaml` (note: Might be covered already with one of the `/*` instances)
   b. `.vscode/settings.json` -> `eslint.workingDirectories`
   c. If being used in `cli`, `apps/cli/cli/tsup.config.ts` -> `noExternal`
4. Do one last `pnpm install` and you should be good to go!
