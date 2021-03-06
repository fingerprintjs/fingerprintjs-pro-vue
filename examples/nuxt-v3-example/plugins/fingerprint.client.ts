import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { fpjsPlugin, FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  nuxtApp.vueApp.use(fpjsPlugin, {
    loadOptions: {
      apiKey: config.public.API_KEY,
    },
  } as FpjsVueOptions);
});
