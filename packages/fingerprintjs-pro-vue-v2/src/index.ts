import { fpjsPlugin } from './plugin';

export * from './plugin';

export { fpjsGetVisitorDataExtendedMixin, fpjsGetVisitorDataMixin } from 'shared/mixins';

export default fpjsPlugin;

export * from 'shared/types';
export * from './vue';
export * from './types';

export { FpjsGetVisitorDataMethod, FpjsVueMixins, FpjsGetVisitorDataMethodThis } from 'shared/mixins.types';

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
