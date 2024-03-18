import type { FpjsClient, FpjsSpaOptions, VisitorData } from '@fingerprintjs/fingerprintjs-pro-spa'

export type FpjsVueOptions = FpjsSpaOptions

export type GetVisitorData = FpjsClient['getVisitorData']
export type ClearCache = FpjsClient['clearCache']

export interface FpjsVueGlobalClient {
  getVisitorData: GetVisitorData
  clearCache: ClearCache
}

export interface FpjsVisitorQueryData<TExtended extends boolean> {
  isLoading: boolean
  data: VisitorData<TExtended> | undefined
  error: Error | undefined
}

export interface FpjsVueQueryOptions {
  /**
   * Determines whether the `getData()` method will be called immediately after function is called or not
   *
   * @default true
   */
  immediate?: boolean
}

export interface GetDataOptions {
  /**
   * Determines whether the method should ignore cache
   *
   * @default false
   * */
  ignoreCache?: boolean
}
