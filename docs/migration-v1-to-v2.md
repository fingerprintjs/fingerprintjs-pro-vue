# Migration from v1.x to v2.0

Version 2.0 upgrades the underlying Fingerprint agent from v3 to v4 and introduces several breaking changes. See also the [JavaScript agent v3 to v4 migration guide](https://docs.fingerprint.com/docs/migrating-from-v3-to-v4).

## Plugin options

Options are now passed directly instead of being nested under `loadOptions`:

```typescript
// Before (v1.x)
app.use(fpjsPlugin, {
  loadOptions: {
    apiKey: '<your-api-key>',
  },
})

// After (v2.0)
app.use(FingerprintPlugin, {
  apiKey: '<your-api-key>',
})
```

A runtime error is thrown if the old `loadOptions` format is detected, prompting you to migrate.

## Renamed exports

| v1.x                              | v2.0                             |
| --------------------------------- | -------------------------------- |
| `fpjsPlugin`                      | `FingerprintPlugin`              |
| `FpjsVueOptions`                  | `FingerprintPluginOptions`       |
| `$fpjs`                           | `$fingerprint`                   |
| `fpjsGetVisitorDataMixin`         | `fingerprintGetVisitorDataMixin` |
| `fpjsGetVisitorDataExtendedMixin` | _(removed)_                      |
| `FingerprintJSPro`                | `Fingerprint`                    |

## useVisitorData

The composable now takes a single options object and returns an `isFetched` ref. `getData()` throws on error instead of returning `undefined`.

```typescript
// Before (v1.x)
const { data, getData, isLoading, error } = useVisitorData(
  { extendedResult: true },
  { immediate: false }
)

// After (v2.0)
const { data, getData, isLoading, isFetched, error } = useVisitorData(
  { immediate: false }
)
```

## Result fields

Agent v4 uses snake_case field names. There is a single result format — the `extendedResult` concept no longer exists.

| v1.x                  | v2.0                                     |
| --------------------- | ---------------------------------------- |
| `result.visitorId`    | `result.visitor_id`                      |
| `result.requestId`    | `result.event_id`                        |
| `result.visitorFound` | _(removed, check `visitor_id` presence)_ |

New fields: `sealed_result`, `suspect_score`, `cache_hit`.

## Removed concepts

- **`extendedResult`** — Agent v4 has a single result format (`GetResult`). All results contain the same fields.
- **`ignoreCache`** — Caching is now configured at the plugin level using the `cache` option in `StartOptions`.
- **`clearCache`** — No longer available. The `CLEAR_CACHE` injection symbol has been removed.
- **SPA re-exports** — `LocalStorageCache`, `SessionStorageCache`, `InMemoryCache`, `CacheLocation`, `Cacheable`, `ICache`, `defaultEndpoint`, `defaultTlsEndpoint`, `defaultScriptUrlPattern` are no longer exported.
- **Vue 2 support** — Vue 2 examples have been removed. The SDK requires Vue 3.1+.
