# Contributing to Fingerprint Vue integration

## Working with code

We use [pnpm](https://pnpm.io/) for installing dependencies and running scripts.

The main branch is locked for the push action. For proposing changes, use the standard [pull request approach](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). It's recommended to discuss fixes or new functionality in the Issues, first.

Install dependencies from the repository root:

```shell
pnpm install
```

### Development playground

This repository contains the Vue 3 SDK at the repository root and example applications in the [examples](./examples) directory.

To rebuild the SDK on file changes, run:

```shell
pnpm watch
```

To run the example applications from the repository root, use workspace filtering. For example:

```shell
pnpm --filter spa-v3-example dev
pnpm --filter nuxt-v3-example dev
```

Applications will automatically refresh on package changes.

### Running unit tests

Run `pnpm test` to execute the unit tests via [Vitest](https://vitest.dev/).

Run `pnpm test:coverage` to generate coverage reports.

### Committing changes

We follow [Conventional Commits](https://conventionalcommits.org/) for committing changes. We use git hooks to check that the commit message is correct.

### How to publish

Affected packages are automatically released and published to NPM on every push to the main branch. The workflow must be approved by one of the maintainers, first.

### Generating docs

We use [typedoc](https://typedoc.org/) to generate docs for the SDK. Run:

```shell
pnpm docs
```

The docs will be generated into [./docs](./docs) directory.

The docs are also automatically deployed to Github Pages on every push to the main branch.
