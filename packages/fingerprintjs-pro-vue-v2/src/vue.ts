import type Vue from 'vue';
import type { FpjsVueGlobal } from './types';

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> extends FpjsVueGlobal {}
}

declare module 'vue/types/vue' {
  interface Vue extends FpjsVueGlobal {}
}
