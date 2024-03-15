import type { FpjsClient, GetOptions } from '@fingerprintjs/fingerprintjs-pro-spa'
import type { ClearCache, GetVisitorData } from './types'

type ClientMethods = {
  getVisitorData: GetVisitorData
  clearCache: ClearCache
}

export function makeClientMethods(client: FpjsClient): ClientMethods {
  const initPromise = client.init()

  const getVisitorData: GetVisitorData = async <TExtended extends boolean>(
    agentOptions: GetOptions<TExtended>,
    ignoreCache?: boolean
  ) => {
    if (typeof window === 'undefined') {
      throw new Error(
        'getVisitorData() can only be called in the browser. If you are using nuxt, you should apply our plugin only on client side.'
      )
    }

    await initPromise

    return client.getVisitorData(agentOptions, ignoreCache)
  }

  const clearCache: ClearCache = client.clearCache.bind(client)

  return {
    clearCache,
    getVisitorData,
  }
}
