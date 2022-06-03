/**
 * If you are having issues with types in Vue 2, you might need to declare this file manually in your project.
 * */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { FpjsExtendedVueMixin, FpjsVueMixin, FpjsVueGlobalProperty } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
import type Vue from 'vue';

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> extends FpjsVueMixin, FpjsExtendedVueMixin {
    $fpjs?: FpjsVueGlobalProperty;
  }
}

declare module 'vue/types/vue' {
  interface Vue extends FpjsVueMixin, FpjsExtendedVueMixin {
    $fpjs?: FpjsVueGlobalProperty;
  }
}
