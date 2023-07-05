import { fpjsPlugin } from './plugin';

export default fpjsPlugin;

export { fpjsGetVisitorDataExtendedMixin, fpjsGetVisitorDataMixin } from 'shared/mixins';

export * from './plugin';
export * from './symbols';
export * from 'shared/types';
export * from './useVisitorData';
export * from './useVisitorData.types';
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
} from '@fingerprintjs/fingerprintjs-pro-spa';
