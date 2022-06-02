import Vue from 'vue';
import App from './App.vue';
import { FpjsVueOptions, fpjsPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v2';

const app = new Vue(App);

const apiKey = import.meta.env.API_KEY ?? (window as any).API_KEY;

Vue.use(fpjsPlugin, {
  loadOptions: {
    apiKey,
  },
} as FpjsVueOptions);

app.$mount('#app');
