import { createApp } from 'vue';
import App from './App.vue';
import { FpjsVueOptions, fpjsPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

const app = createApp(App);

const apiKey = import.meta.env.API_KEY ?? (window as any).API_KEY;

app
  .use(fpjsPlugin, {
    loadOptions: {
      apiKey,
    },
  } as FpjsVueOptions)
  .mount('#app');
