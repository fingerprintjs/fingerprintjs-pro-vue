---
"@fingerprintjs/fingerprintjs-pro-vue-v3": major
---

Upgrade to JavaScript agent v4

**Breaking changes:**

- Replaced `@fingerprintjs/fingerprintjs-pro-spa` dependency with `@fingerprint/agent` v4
- Plugin options are now passed directly instead of nested under `loadOptions` — use `{ apiKey: '...' }` instead of `{ loadOptions: { apiKey: '...' } }`
- Renamed `fpjsPlugin` to `FingerprintPlugin`, `FpjsVueOptions` to `FingerprintPluginOptions`
- Renamed `$fpjs` global property to `$fingerprint`
- Renamed `fpjsGetVisitorDataMixin` to `fingerprintGetVisitorDataMixin`
- Removed `fpjsGetVisitorDataExtendedMixin` — agent v4 has a single result format, no `extendedResult` distinction
- Removed `extendedResult`, `ignoreCache`, and `clearCache` options
- Removed `CLEAR_CACHE` injection symbol
- Removed SPA re-exports: `LocalStorageCache`, `SessionStorageCache`, `InMemoryCache`, `CacheLocation`, `Cacheable`, `ICache`, `defaultEndpoint`, `defaultTlsEndpoint`, `defaultScriptUrlPattern`, `FingerprintJSPro`
- Result fields now use snake_case: `visitor_id`, `event_id`, `sealed_result`, `cache_hit`, `suspect_score`
- `useVisitorData()` takes a single options object, returns `isFetched` ref, and `getData()` throws on failure
- Added `Fingerprint` namespace re-export for direct agent access
- Dropped Vue 2 support
