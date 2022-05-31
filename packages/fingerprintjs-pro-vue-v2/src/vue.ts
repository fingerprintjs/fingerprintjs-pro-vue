import type { FpjsVueGlobalProperty } from 'shared/types';
import type BaseVue from 'vue';

declare module 'vue' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends BaseVue> {
    $fpjs?: FpjsVueGlobalProperty;
  }
}
