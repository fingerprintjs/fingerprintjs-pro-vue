import { fpjsPlugin } from './plugin';

export default fpjsPlugin;

export { fpjsGetVisitorDataExtendedMixin, fpjsGetVisitorDataMixin } from 'shared/mixins';

export * from './plugin';
export * from './symbols';
export * from 'shared/types';
export * from './useVisitorData';
export * from './useVisitorData.types';
export * from './vue';

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
  GetOptions,
} from '@fingerprintjs/fingerprintjs-pro-spa';
