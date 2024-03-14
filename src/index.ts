import { fpjsPlugin } from './plugin';

export default fpjsPlugin;

export { fpjsGetVisitorDataExtendedMixin, fpjsGetVisitorDataMixin } from './mixins/mixins';

export * from './plugin';
export * from './symbols';
export * from './types';
export * from './useVisitorData/useVisitorData';
export * from './useVisitorData/useVisitorData.types';
export * from './vue';

export type {
  CacheLocation,
  Cacheable,
  ICache,
  LoadOptions,
  VisitorData,
  GetResult,
  ExtendedGetResult,
  FpjsClientOptions,
} from '@fingerprintjs/fingerprintjs-pro-spa';

export {
  defaultEndpoint,
  defaultTlsEndpoint,
  defaultScriptUrlPattern,
  LocalStorageCache,
  SessionStorageCache,
  InMemoryCache,
  FingerprintJSPro,
} from '@fingerprintjs/fingerprintjs-pro-spa';
