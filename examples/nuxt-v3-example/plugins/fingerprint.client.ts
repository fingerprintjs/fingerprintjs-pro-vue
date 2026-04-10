import { FingerprintPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  nuxtApp.vueApp.use(FingerprintPlugin, {
    apiKey: config.public.API_KEY as string,
  })
})
