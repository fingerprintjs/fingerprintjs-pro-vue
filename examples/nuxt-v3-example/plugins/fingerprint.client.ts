import { FingerprintPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { loadCacheConfig } from '../../components-v3/src/cacheConfig'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  nuxtApp.vueApp.use(FingerprintPlugin, {
    apiKey: config.public.API_KEY,
    cache: loadCacheConfig(),
  })
})
