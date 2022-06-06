import type { FpjsVueGlobalClient } from 'shared/types';
import { FpjsVueMixins } from 'shared/mixins.types';

declare module 'vue' {
  interface ComponentCustomProperties extends Partial<FpjsVueMixins> {
    $fpjs: FpjsVueGlobalClient;
  }
}
