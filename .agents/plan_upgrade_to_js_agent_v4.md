# Upgrade Plan: JavaScript Agent v4 Support

## Goal

Implement the first breaking-major PR that upgrades the Vue SDK from the SPA wrapper model to JavaScript agent v4 semantics, without package/repository renaming and without tooling changes.

This plan assumes the tooling upgrade PR lands first.

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
- Add `collect()` as a supported public API
- Add `useFingerprint()` for Composition API access to imperative methods
- Update tests, README, and local examples
- Add a migration guide to the README

### Out of scope

- package rename
- repository rename
- tooling/build/test modernization
- generated docs artifacts
- extra environment tagging
- compatibility aliases for old names
- compatibility transforms for old config beyond a minimal runtime guard for `loadOptions`

## Target Public API

### Exports

- `FingerprintPlugin`
- `FingerprintPluginOptions`
- `useVisitorData`
- `useFingerprint`
- `fingerprintGetVisitorDataMixin`
- `fingerprintCollectMixin`
- default export -> `FingerprintPlugin`
- direct re-exports from `@fingerprint/agent`

### Global property

- `$fingerprint`

### Imperative methods

- `getVisitorData(options?)`
- `collect(options?)`

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

### useFingerprint

Add `useFingerprint()` as a small Composition API helper that exposes:

- `getVisitorData`
- `collect`

It should fail fast with a clear plugin-missing error if the plugin is not installed.

Implementation location:

- add [`src/useFingerprint.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/useFingerprint.ts)
- export it from [`src/index.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/index.ts)

### Global client

`$fingerprint` should expose:

- `getVisitorData`
- `collect`

It should not expose `clearCache`.

### Mixins

Replace the old mixin split with:

- `fingerprintGetVisitorDataMixin`
- `fingerprintCollectMixin`

Mixin methods/state:

- `$getVisitorData`
- `$collect`
- `visitorData`
- `collectData`

Both mixins should expose `{ data, isLoading, isFetched, error }`.

`collect()` should use the agent's native collect return type, and `collectData.data` should use that same type.

## Implementation Plan

### 1. Dependency and package surface

- Update [`package.json`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/package.json) to replace `@fingerprintjs/fingerprintjs-pro-spa` with `@fingerprint/agent`
- Keep package name and repository metadata unchanged for this PR
- Update lockfile as required by the dependency change

### 2. Rewrite top-level exports

- Update [`src/index.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/index.ts)
- Re-export `@fingerprint/agent` directly, following the React SDK pattern
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
- Implement thin wrappers for:
  - `getVisitorData(options?)` -> `agent.get(options)`
  - `collect(options?)` -> `agent.collect(options)`
- Keep browser-only runtime guards here
- Preserve shared startup behavior across plugin, composables, and mixins

### 6. Integration metadata

- Update [`src/config.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/config.ts)
- Keep appending integration info rather than replacing caller-provided `integrationInfo`
- Preserve the existing integration marker format because it is depended on externally
- Do not introduce Vue/Nuxt-specific environment tagging in this PR

### 7. Public types and module augmentation

- Rewrite [`src/types.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/types.ts)
- Remove SPA-wrapper-specific types and generics
- Define `FingerprintPluginOptions = StartOptions`
- Define the global client as `{ getVisitorData, collect }`
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
- Make `getData()` throw on error
- Add `useFingerprint()` for Composition API imperative access

### 9. Mixin rewrite

- Rewrite [`src/mixins/mixins.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/src/mixins/mixins.ts)
- Update related mixin typing files
- Remove the old default/extended dual-mixin model
- Introduce:
  - `fingerprintGetVisitorDataMixin`
  - `fingerprintCollectMixin`
- Use the new `{ data, isLoading, isFetched, error }` query-state shape

### 10. Test migration

- Rewrite test mocks in [`__tests__/setup.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/__tests__/setup.ts)
- Mock `@fingerprint/agent`, `start()`, and the returned agent methods
- Update:
  - [`__tests__/plugin.test.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/__tests__/plugin.test.ts)
  - [`__tests__/useVisitorData.test.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/__tests__/useVisitorData.test.ts)
  - [`__tests__/mixin.test.ts`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/__tests__/mixin.test.ts)
- Cover:
  - renamed public API
  - eager startup behavior
  - `useVisitorData()` state transitions with `isFetched`
  - thrown errors
  - `useFingerprint()`
  - `collect()` via global client and mixins
  - v4 result field names
- Do not add extra legacy failure-path coverage beyond normal migration updates

### 11. README and docs

- Update [`README.md`](/Users/jurajuhlar/Documents/Code/fp-client-sdks/vue/README.md) to reflect the new API
- Remove “extended result” terminology everywhere except the migration guide
- Lead with:
  - `useVisitorData()`
  - `$fingerprint`
  - `useFingerprint()`
- Mention mixins as supported but secondary
- Document `collect()`
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

## Explicitly Removed Concepts

These should be called out clearly in migration messaging:

- `loadOptions`
- `extendedResult`
- `ignoreCache`
- `clearCache`
- `fpjs*` names
- `$fpjs`

## PR Review Checklist

- Dependency switched to `@fingerprint/agent`
- Public exports renamed to the agreed `Fingerprint*` surface
- Default export preserved
- Plugin options align with `StartOptions`
- Minimal runtime guard added for old `loadOptions`
- `$fingerprint` replaces `$fpjs`
- `useVisitorData()` simplified and returns `isFetched`
- `getData()` throws on failure
- `useFingerprint()` added
- `collect()` exposed on global client and mixins
- Mixins renamed and unified around v4 semantics
- Tests updated to mock `@fingerprint/agent`
- README updated with migration section
- Examples updated
- No tooling/package-rename scope creep
