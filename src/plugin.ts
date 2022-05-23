import type { Plugin } from 'vue';
import { FpjsClient, FpjsClientOptions } from '@fingerprintjs/fingerprintjs-pro-spa';
import * as packageInfo from '../package.json';
import type { GetOptions } from '@fingerprintjs/fingerprintjs-pro';
import type { FpjsVueGlobalProperty, FpjsVueOptions } from './types';
import { CLEAR_CACHE, GET_VISITOR_DATA } from './symbols';
import { ClearCache, GetVisitorData } from './types';

const getOptions = (options: FpjsClientOptions) => {
  const clientOptions: FpjsClientOptions = {
    ...options,
    loadOptions: {
      ...options.loadOptions,
      integrationInfo: [
        ...(options.loadOptions?.integrationInfo ?? []),
        `fingerprintjs-pro-vue/${packageInfo.version}`,
      ],
    },
  };
  return clientOptions;
};

/**
 * FingerprintJS Pro plugin
 *
 * @example ```ts
 * import { createApp } from 'vue';
 * import App from './App.vue';
 * import fpjsPlugin, { FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue';
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
    const client = new FpjsClient(getOptions(options));

    const getVisitorData: GetVisitorData = async <TExtended extends boolean>(
      agentOptions: GetOptions<TExtended>,
      ignoreCache?: boolean
    ) => {
      await client.init();

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
