import { fpjsPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import type { FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  nuxtApp.vueApp.use(fpjsPlugin, {
    loadOptions: {
      apiKey: config.public.API_KEY,
    },
  } as FpjsVueOptions)
})
