/**
 * If you are having issues with types in Vue 2, you might need to declare this file manually in your project.
 * */

/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue';
import 'vite/client';
import { FpjsVueGlobalProperty } from '@fingerprintjs/fingerprintjs-pro-vue-v2';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $fpjs?: FpjsVueGlobalProperty;
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    $fpjs?: FpjsVueGlobalProperty;
  }
}
