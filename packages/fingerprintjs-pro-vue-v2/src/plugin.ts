import type { PluginObject } from 'vue';
import { FpjsClient } from '@fingerprintjs/fingerprintjs-pro-spa';
import { FpjsVueGlobalProperty, FpjsVueOptions } from 'shared/types';
import { getOptions } from 'shared/config';
import * as packageInfo from '../package.json';
import { makeClientMethods } from 'shared/client';

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

    const { getVisitorData, clearCache } = makeClientMethods(client);

    Vue.prototype.$fpjs = {
      getVisitorData,
      clearCache,
    } as FpjsVueGlobalProperty;
  },
};
