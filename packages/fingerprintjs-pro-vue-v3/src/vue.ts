import type { FpjsVueGlobalProperty } from './types';

declare module 'vue' {
  interface ComponentCustomProperties {
    $fpjs: FpjsVueGlobalProperty;
  }
}
