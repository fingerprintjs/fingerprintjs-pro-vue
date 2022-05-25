import type { FpjsVueGlobalProperty } from 'shared/types';

declare module 'vue' {
  interface ComponentCustomProperties {
    $fpjs: FpjsVueGlobalProperty;
  }
}
