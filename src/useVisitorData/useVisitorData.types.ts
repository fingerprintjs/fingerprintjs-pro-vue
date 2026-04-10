import type { GetOptions, GetResult } from '@fingerprint/agent'
import type { Ref } from 'vue'
import type { FingerprintVisitorQueryData } from '../types'

type AsRefs<T> = {
  [K in keyof T]: Ref<T[K]>
}

export type UseGetVisitorDataResult = AsRefs<FingerprintVisitorQueryData> & {
  /**
   * Fetches visitor data. Throws on failure.
   */
  getData: (options?: GetOptions) => Promise<GetResult>
}

export type UseVisitorDataOptions = GetOptions & {
  /**
   * Determines whether getData() will be called immediately on mount.
   * @default true
   */
  immediate?: boolean
}
