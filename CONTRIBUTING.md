# Contributing to FingerprintJS Pro Vue integration

## Working with code

We prefer using [yarn](https://yarnpkg.com/) for installing dependencies and running scripts.

The main branch is locked for the push action. For proposing changes, use the standard [pull request approach](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). It's recommended to discuss fixes or new functionality in the Issues, first.

We are using [NX](https://nx.dev) for orchestrating our monorepo.

### Development playground

This repository contains packages with the Vue plugin (for versions 2 and 3) that can be found in the [packages](./packages) directory.
Every package has associated examples in the [examples](./examples) directory.

To watch library run `npx nx run $PROJECT_NAME:watch`, ex:
```shell
npx nx run fingerprintjs-pro-vue-v2:watch
```

To run the example applications use `npx nx run $PROJECT_NAME:dev`, e.g.,
```shell
npx nx run spa-v2-example:dev
```

Applications will automatically refresh on package changes.

### Running unit tests

Run `yarn test` to execute the unit tests via [Jest](https://jestjs.io/) in every package.

Alternatively, you can use `npx nx test $PROJECT_NAME` to test only the specific package, e.g.,
```shell
npx nx test fingerprintjs-pro-vue-v2
```

### Committing changes

We follow [Conventional Commits](https://conventionalcommits.org/) for committing changes. We use git hooks to check that the commit message is correct.

### Further help

To get more help on the NX use `npx nx help` or check out the [docs](https://nx.dev/getting-started/intro).

### How to publish

Affected packages are automatically released and published to NPM on every push to the main branch. The workflow must be approved by one of the maintainers, first.

### Generating docs

We use [typedoc](https://typedoc.org/) to generate docs. To generate docs for library run `npx nx run $PROJECT_NAME:docs`, ex:
```shell
npx nx run fingerprintjs-pro-vue-v2:docs
```
The docs will be generated into [./docs](./docs) directory.

The docs are also automatically deployed to Github Pages on every push to the main branch.
