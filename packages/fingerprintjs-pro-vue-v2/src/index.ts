import { fpjsPlugin } from './plugin';

export * from './plugin';

export { fpjsGetVisitorDataExtendedMixin, fpjsGetVisitorDataMixin } from 'shared/mixins';

export default fpjsPlugin;

export * from 'shared/types';
export * from './vue';
export * from './types';

export { FpjsGetVisitorDataMethod, FpjsVueMixins, FpjsGetVisitorDataMethodThis } from 'shared/mixins.types';

export {
  CacheLocation,
  Cacheable,
  ICache,
  LocalStorageCache,
  SessionStorageCache,
  InMemoryCache,
  LoadOptions,
  VisitorData,
  GetResult,
  ExtendedGetResult,
  FpjsClientOptions,
} from '@fingerprintjs/fingerprintjs-pro-spa';
