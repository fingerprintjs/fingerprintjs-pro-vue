import { fpjsPlugin, FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
import Vue from 'vue';

Vue.use(fpjsPlugin, {
  loadOptions: {
    apiKey: process.env.API_KEY,
  },
} as FpjsVueOptions);
