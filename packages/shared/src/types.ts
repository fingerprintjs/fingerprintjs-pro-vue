import type { FpjsClient, FpjsClientOptions } from '@fingerprintjs/fingerprintjs-pro-spa';

export type FpjsVueOptions = FpjsClientOptions;

export type GetVisitorData = FpjsClient['getVisitorData'];
export type ClearCache = FpjsClient['clearCache'];

export interface FpjsVueGlobalProperty {
  getVisitorData: GetVisitorData;
  clearCache: ClearCache;
}
