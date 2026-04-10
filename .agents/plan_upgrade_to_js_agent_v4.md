# Upgrade Plan: JavaScript Agent v4 Support

## Goal

Implement the first breaking-major PR that upgrades the Vue SDK from the SPA wrapper model to JavaScript agent v4 semantics, without package/repository renaming and without tooling changes.

This branch is based on `upgrade-tooling`, which already migrated from Rollup/Jest to Vite/Vitest and from semantic-release to changesets.

This PR should mirror the sequencing used in the React SDK:

- migrate to agent v4 first
- keep rename and broader cleanup for follow-up PRs

## Agreed Scope

### In scope

- Replace `@fingerprintjs/fingerprintjs-pro-spa` with `@fingerprint/agent`
- Keep package/repository identity unchanged
- Rename the Vue public API from `fpjs*` to `Fingerprint*`
- Keep default export, mapped to `FingerprintPlugin`
- Align plugin options with agent v4 `StartOptions`
- Preserve eager startup behavior
- Preserve current SSR behavior
- Keep appending the existing integration marker format to `integrationInfo`
- Remove legacy SPA-wrapper concepts:
  - `loadOptions`
  - `extendedResult`
  - `ignoreCache`
  - `clearCache`
- Re-export `@fingerprint/agent` so users can access `start()`, `collect()`, etc. directly
- Update tests, README, and local examples
- Add a migration guide to the README

### Out of scope

- package rename
- repository rename
- tooling/build/test modernization (already done in `upgrade-tooling`)
- generated docs artifacts
- extra environment tagging
- compatibility aliases for old names
- compatibility transforms for old config beyond a minimal runtime guard for `loadOptions`

## Target Public API

### Exports

- `FingerprintPlugin`
- `FingerprintPluginOptions`
- `useVisitorData`
- `fingerprintGetVisitorDataMixin`
- default export -> `FingerprintPlugin`
- direct re-exports from `@fingerprint/agent` (e.g. `start`, `StartOptions`, `GetOptions`, `GetResult`, `CollectResult`, `Region`, `CacheConfig`) — users who need `collect()` can call `start()` directly to get an agent instance

### Global property

- `$fingerprint`

### Imperative methods

- `getVisitorData(options?)`

### Removed public names

- all `fpjs*` public exports
- `$fpjs`
- old extended/default mixin split
- `clearCache`

## Behavior Changes

### Plugin options

Old shape:

```ts
app.use(fpjsPlugin, {
  loadOptions: {
    apiKey: '...'
  },
})
```

New shape:

```ts
app.use(FingerprintPlugin, {
  apiKey: '...',
})
```

`FingerprintPluginOptions` should be a direct alias of `StartOptions`.

### Result model

Adopt v4-native `GetResult` semantics and field names, including snake_case fields such as:

- `visitor_id`
- `event_id`
- `sealed_result`
- `cache_hit`

### useVisitorData

Keep `useVisitorData()`, but simplify it:

- single options object
- `UseVisitorDataOptions = GetOptions & { immediate?: boolean }`
- no generic extended-result model
- preserve ref-based return shape
- add `isFetched`
- `getData()` throws on failure

Target state model:

- idle: `isLoading=false`, `isFetched=false`, `data=undefined`, `error=undefined`
- loading: `isLoading=true`, `isFetched=false`
- success: `isLoading=false`, `isFetched=true`, `data=GetResult`
- error: `isLoading=false`, `isFetched=false`, `error=Error`

### Global client

`$fingerprint` should expose:

- `getVisitorData`

It should not expose `clearCache` or `collect`.

### Mixins

Replace the old mixin split with a single mixin:

- `fingerprintGetVisitorDataMixin`

Mixin methods/state:

- `$getVisitorData`
- `visitorData`

The mixin's reactive property (`visitorData`) is a nested object containing `{ data, isLoading, isFetched, error }`, matching the current nesting pattern.

## Implementation Plan

### 1. Dependency and package surface

- Update [`package.json`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/package.json) to replace `@fingerprintjs/fingerprintjs-pro-spa` with `@fingerprint/agent`
- Keep package name and repository metadata unchanged for this PR
- Run `pnpm install` to update `pnpm-lock.yaml`
- No build config change needed — `vite.config.ts` derives externals from `package.json` `dependencies` automatically

### 2. Rewrite top-level exports

- Update [`src/index.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/index.ts)
- Re-export `@fingerprint/agent` types and values directly, following the React SDK pattern
- Removed re-exports that no longer exist in v4: `LocalStorageCache`, `SessionStorageCache`, `InMemoryCache`, `CacheLocation`, `Cacheable`, `ICache`, `LoadOptions`, `ExtendedGetResult`, `FpjsClientOptions`, `defaultEndpoint`, `defaultTlsEndpoint`, `defaultScriptUrlPattern`, `FingerprintJSPro`
- Export the renamed Vue API surface
- Keep default export pointing to `FingerprintPlugin`

### 3. Rewrite plugin startup

- Rewrite [`src/plugin.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/plugin.ts) around `start(options)` from `@fingerprint/agent`
- Rename plugin export to `FingerprintPlugin`
- Rename options type to `FingerprintPluginOptions`
- Preserve eager initialization behavior by creating one shared started-agent path during plugin install
- Keep provide/inject as the internal backbone
- Keep global property support for Options API

### 4. Minimal runtime migration guard

- Detect old-style plugin config containing `loadOptions`
- Throw a concise migration-oriented runtime error
- Keep the guard minimal; only guard `loadOptions`

### 5. Internal client wrapper

- Replace the SPA-client wrapper in [`src/client.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/client.ts)
- Implement thin wrapper for:
  - `getVisitorData(options?)` -> `agent.get(options)`
- Keep browser-only runtime guards here
- Preserve shared startup behavior across plugin, composables, and mixins
- Update [`src/symbols.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/symbols.ts) injection key to use the new client type

### 6. Integration metadata

- Update [`src/config.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/config.ts)
- Keep appending integration info rather than replacing caller-provided `integrationInfo`
- Preserve the existing integration marker format because it is depended on externally
- Do not introduce Vue/Nuxt-specific environment tagging in this PR

### 7. Public types and module augmentation

- Rewrite [`src/types.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/types.ts)
- Remove SPA-wrapper-specific types and generics
- Define `FingerprintPluginOptions = StartOptions`
- Define the global client as `{ getVisitorData }`
- Update [`src/vue.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/vue.ts) to expose only `$fingerprint`

### 8. Composition API updates

- Refactor [`src/useVisitorData/useVisitorData.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/useVisitorData/useVisitorData.ts)
- Refactor [`src/useVisitorData/useVisitorData.types.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/useVisitorData/useVisitorData.types.ts)
- Remove:
  - `extendedResult`
  - `ignoreCache`
  - boolean generic typing
- Add `isFetched`
- Keep ref-based return values
- Make `getData()` throw on error and return `Promise<GetResult>` (non-nullable on success)
- `getData()` accepts `GetOptions` to allow per-call overrides of `timeout`/`tag`/`linkedId`
### 9. Mixin rewrite

- Rewrite [`src/mixins/mixins.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/mixins/mixins.ts)
- Update related mixin typing files
- Remove the old default/extended dual-mixin model
- Keep a single `fingerprintGetVisitorDataMixin`
- Use the new `{ data, isLoading, isFetched, error }` query-state shape

### 10. Test migration

- Rewrite test mocks in [`__tests__/setup.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/__tests__/setup.ts) using Vitest (`vi.mock`, `vi.fn()`)
- Mock `@fingerprint/agent`, `start()`, and the returned agent method (`get`)
- Update:
  - [`__tests__/plugin.test.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/__tests__/plugin.test.ts)
  - [`__tests__/useVisitorData.test.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/__tests__/useVisitorData.test.ts)
  - [`__tests__/mixin.test.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/__tests__/mixin.test.ts)
- Cover:
  - renamed public API
  - eager startup behavior
  - `useVisitorData()` state transitions with `isFetched`
  - thrown errors
  - v4 result field names
- Do not add extra legacy failure-path coverage beyond normal migration updates

### 11. README and docs

- Update [`README.md`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/README.md) to reflect the new API
- Remove “extended result” terminology everywhere except the migration guide
- Lead with:
  - `useVisitorData()`
  - `$fingerprint`
- Mention mixins as supported but secondary
- Add a migration section with before/after snippets for:
  - plugin installation options
  - `useVisitorData()` signature
  - result field shape changes
- Note that the runtime migration guard only covers old `loadOptions`; other removed legacy options fail through normal type/runtime mismatches

### 12. Example updates

- Update examples to the new API surface:
  - [`examples/spa-v3-example`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/examples/spa-v3-example)
  - [`examples/nuxt-v3-example`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/examples/nuxt-v3-example)
  - [`examples/components-v3`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/examples/components-v3)
- Keep example directory names unchanged for this PR
- Update imports, plugin config, result field usage, and removed option usage
- Remove Vue 2 / Nuxt 2 examples (`spa-v2-example`, `nuxt-v2-example`) — no longer supported

## Explicitly Removed Concepts

These should be called out clearly in migration messaging:

- `loadOptions`
- `extendedResult`
- `ignoreCache`
- `clearCache`
- `fpjs*` names
- `$fpjs`
- SPA cache re-exports: `LocalStorageCache`, `SessionStorageCache`, `InMemoryCache`, `CacheLocation`, `Cacheable`, `ICache`
- SPA utility re-exports: `defaultEndpoint`, `defaultTlsEndpoint`, `defaultScriptUrlPattern`, `FingerprintJSPro`

## PR Review Checklist

- Dependency switched to `@fingerprint/agent`
- Public exports renamed to the agreed `Fingerprint*` surface
- Default export preserved
- Plugin options align with `StartOptions`
- Minimal runtime guard added for old `loadOptions`
- `$fingerprint` replaces `$fpjs`
- `useVisitorData()` simplified and returns `isFetched`
- `getData()` throws on failure
- `@fingerprint/agent` re-exported (including `start()`) for direct agent access
- Mixin consolidated to single `fingerprintGetVisitorDataMixin`
- Tests updated to mock `@fingerprint/agent`
- README updated with migration section
- Examples updated
- No tooling/package-rename scope creep
