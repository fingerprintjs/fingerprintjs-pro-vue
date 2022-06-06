import type { FpjsVueGlobalClient } from 'shared/types';

declare module 'vue' {
  interface ComponentCustomProperties {
    $fpjs: FpjsVueGlobalClient;
  }
}
