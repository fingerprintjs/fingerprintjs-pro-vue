import type Vue from 'vue';
import type { FpjsVueGlobalProperty } from 'shared/types';
import type { FpjsVueMixins } from 'shared/mixins.types';

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> extends Partial<FpjsVueMixins> {
    $fpjs?: FpjsVueGlobalProperty;
  }
}

declare module 'vue/types/vue' {
  interface Vue extends Partial<FpjsVueMixins> {
    $fpjs?: FpjsVueGlobalProperty;
  }
}
