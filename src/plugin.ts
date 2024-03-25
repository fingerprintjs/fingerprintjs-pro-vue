import type { Plugin } from 'vue'
import { FpjsClient } from '@fingerprintjs/fingerprintjs-pro-spa'
import * as packageInfo from '..//package.json'
import { CLEAR_CACHE, GET_VISITOR_DATA } from './symbols'
import { FpjsVueGlobalClient, FpjsVueOptions } from './types'
import { getOptions } from './config'
import { makeClientMethods } from './client'

/**
 * Fingerprint Pro plugin
 *
 * @example ```ts
 * import { createApp } from 'vue';
 * import App from './App.vue';
 * import fpjsPlugin, { FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v3';
 *
 * const app = createApp(App);
 *
 * const apiKey = '<YOUR_API_KEY>'
 *
 * app
 *   .use(fpjsPlugin, {
 *     loadOptions: {
 *       apiKey,
 *     },
 *   } as FpjsVueOptions)
 *   .mount('#app');
 * ```
 * */
export const fpjsPlugin: Plugin = {
  install: (app, options: FpjsVueOptions) => {
    const client = new FpjsClient(getOptions(options, 'fingerprintjs-pro-vue-v3', packageInfo.version))

    const { getVisitorData, clearCache } = makeClientMethods(client)

    app.provide(GET_VISITOR_DATA, getVisitorData)
    app.provide(CLEAR_CACHE, clearCache)

    app.config.globalProperties.$fpjs = {
      getVisitorData,
      clearCache,
    } as FpjsVueGlobalClient
  },
}
