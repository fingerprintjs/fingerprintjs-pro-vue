/**
 * If you are having issues with types in Vue 2, you might need to declare this file manually in your project.
 * */

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FpjsVueMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
import type Vue from 'vue';
import type { FpjsVueGlobal } from '@fingerprintjs/fingerprintjs-pro-vue-v2/src/types';

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> extends FpjsVueGlobal {}
}

declare module 'vue/types/vue' {
  interface Vue extends FpjsVueGlobal {}
}
