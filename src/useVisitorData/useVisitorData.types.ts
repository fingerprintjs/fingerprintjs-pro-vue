import type { GetOptions, VisitorData } from '@fingerprintjs/fingerprintjs-pro-spa'
import type { Ref } from 'vue'
import type { FpjsVisitorQueryData, GetDataOptions } from '../types'

type AsRefs<T> = {
  [K in keyof T]: Ref<T[K]>
}

export type UseGetVisitorDataResult<TExtended extends boolean> = AsRefs<FpjsVisitorQueryData<TExtended>> & {
  /**
   * Fetches visitor data.
   * */
  getData: (options?: GetDataOptions) => Promise<VisitorData<TExtended> | undefined>
}

export type UseVisitorDataOptions<TExtended extends boolean> = GetOptions<TExtended> & Partial<GetDataOptions>
