import type { FpjsVueGlobalProperty } from 'shared/types';
import type Vue from 'vue';

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    $fpjs?: FpjsVueGlobalProperty;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $fpjs?: FpjsVueGlobalProperty;
  }
}
