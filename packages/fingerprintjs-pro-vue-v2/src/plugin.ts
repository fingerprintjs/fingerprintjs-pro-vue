import type { PluginObject } from 'vue';
import { FpjsClient, GetOptions } from '@fingerprintjs/fingerprintjs-pro-spa';
import { ClearCache, FpjsVueGlobalProperty, FpjsVueOptions, GetVisitorData } from 'shared/types';
import { getOptions } from 'shared/config';
import * as packageInfo from '../package.json';

/**
 * FingerprintJS Pro plugin
 *
 * @example ```ts
 * import { Vue } from 'vue';
 * import App from './App.vue';
 * import fpjsPlugin, { FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
 *
 * const app = new Vue();
 *
 * const apiKey = '<YOUR_API_KEY>'
 *
 * app
 *   .use(fpjsPlugin, {
 *     loadOptions: {
 *       apiKey,
 *     },
 *   } as FpjsVueOptions)
 *   .$mount('#app');
 * ```
 * */
export const fpjsPlugin: PluginObject<FpjsVueOptions> = {
  install: (Vue, options?: FpjsVueOptions) => {
    if (!options) {
      throw new TypeError('Options are missing.');
    }

    const client = new FpjsClient(getOptions(options, 'fingerprintjs-pro-vue-v2', packageInfo.version));
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

    Vue.prototype.$fpjs = {
      getVisitorData,
      clearCache,
    } as FpjsVueGlobalProperty;
  },
};
