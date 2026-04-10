import { createApp } from 'vue'
import App from './App.vue'
import { FingerprintPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v3'

const app = createApp(App)

const apiKey = import.meta.env.API_KEY ?? (window as any).API_KEY

app
  .use(FingerprintPlugin, {
    apiKey,
  })
  .mount('#app')
