import { fpjsPlugin, FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import { defineNuxtPlugin, Plugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  nuxtApp.vueApp.use(
    fpjsPlugin as unknown as Plugin,
    {
      loadOptions: {
        apiKey: config.public.API_KEY,
      },
    } as FpjsVueOptions
  )
})
