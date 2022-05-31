import type { Plugin } from 'vue';
import { FpjsClient, GetOptions } from '@fingerprintjs/fingerprintjs-pro-spa';
import * as packageInfo from '../package.json';
import { CLEAR_CACHE, GET_VISITOR_DATA } from './symbols';
import { ClearCache, FpjsVueGlobalProperty, FpjsVueOptions, GetVisitorData } from 'shared/types';
import { getOptions } from 'shared/config';

/**
 * FingerprintJS Pro plugin
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
    const client = new FpjsClient(getOptions(options, 'fingerprintjs-pro-vue-v3', packageInfo.version));
    const initPromise = client.init();

    const getVisitorData: GetVisitorData = async <TExtended extends boolean>(
      agentOptions: GetOptions<TExtended>,
      ignoreCache?: boolean
    ) => {
      if (typeof window === 'undefined') {
        throw new Error(
          'getVisitorData() can only be called in the browser. If you are using nuxt, you should apply our plugin only on client side.'
        );
      }

      await initPromise;

      return client.getVisitorData(agentOptions, ignoreCache);
    };

    const clearCache: ClearCache = client.clearCache.bind(client);

    app.provide(GET_VISITOR_DATA, getVisitorData);
    app.provide(CLEAR_CACHE, clearCache);

    app.config.globalProperties.$fpjs = {
      getVisitorData,
      clearCache,
    } as FpjsVueGlobalProperty;
  },
};
