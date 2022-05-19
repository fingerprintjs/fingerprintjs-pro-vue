<p align="center">
  <a href="https://fingerprintjs.com">
    <img src="resources/logo.svg" alt="FingerprintJS" width="312px" />
  </a>
</p>
<p align="center">
  <a href="https://github.com/fingerprintjs/library-template-typescript/actions/workflows/build.yml">
    <img src="https://github.com/fingerprintjs/library-template-typescript/actions/workflows/build.yml/badge.svg" alt="Build status">
  </a>
</p>
This is template repository for creating TypeScript libraries by FingerprintJS team.

## Quick start

1. Clone this repository, remove `.git` folder and call `git init` / Use `Use this template` GitHub button
2. Setup project specific fields in package.json
3. Setup `artifactName` and other build properties in `rollup.config.js`
4. If your project emits `.d.ts` typings, set correct path in `package.json` for `test:dts` command or remove it 
5. Use `src` folder to organize your code and put tests in `__test__` folder
6. If you want isolated run you can use Docker
7. Push your repo, check that GitHub actions works
8. Add badges
9. You are awesome!

## Best practice

### Choosing name for repository

Check [FingerprintJS naming conventions](https://github.com/fingerprintjs/home/wiki/FingerprintJS-Naming-Conventions)

### Team best practise

Described in [Integrations and repositories best practices](https://github.com/fingerprintjs/home/wiki/Integrations-and-repositories-best-practices)

### Publish to npm

You can automize publishing to npm using GitHub action.

1. Create an action file and add project build steps
   1. Don't forget to set up your main branch
   2. Set up commands to build and check your product

```yaml
name: release
on:
  push:
    branches:
      - main
    paths-ignore:
      - '**.md'

jobs:
  npm-publish:
    name: npm-publish
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Cache
        uses: actions/cache@v2
        with:
          path: node_modules
          key: nodemodules-${{ hashFiles('yarn.lock') }}
          restore-keys: nodemodules-
      - name: Install Node packages
        run: yarn install
      - name: Build
        run: yarn build
      - name: Run tests
        run: yarn test
      - name: Publish if version has been updated
        uses: pascalgn/npm-publish-action@e05dd3cd13412801d978714d8eac1cb922826da1
        with:
          tag_name: "v%s"
          tag_message: "v%s"
          commit_pattern: "^v?(\\d+\\.\\d+\\.\\d+(?:-(?:alpha|beta)\\.\\d+)?)$"
          publish_command: "yarn"
          publish_args: "--non-interactive --access=public --new-version"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}
```
2. Add `NPM_AUTH_TOKEN` to the repository secrets area
3. Add `generate-changelog` package in `devDependencies` section of `package.json`
4. Add release scripts to `package.json`
```json
{
  "release:major": "changelog -M && git add CHANGELOG.md && yarn version --major --no-git-tag-version",
  "release:minor": "changelog -m && git add CHANGELOG.md && yarn version --minor --no-git-tag-version",
  "release:patch": "changelog -p && git add CHANGELOG.md && yarn version --patch --no-git-tag-version"
}
```
5. Run yarn release:(major|minor|patch) depending on the version you need
6. Package will publish after getting release commits into the main branch
7. You are awesome!

### Preparing product for release
Just follow [checklist for publishing new integration](https://github.com/fingerprintjs/home/wiki/Checklist-for-publishing-new-integration)
