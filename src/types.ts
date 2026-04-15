import type { GetOptions, GetResult, StartOptions } from '@fingerprint/agent'

export type FingerprintPluginOptions = StartOptions

export type GetVisitorData = (options?: GetOptions) => Promise<GetResult>

export interface FingerprintVueGlobalClient {
  getVisitorData: GetVisitorData
}

export interface FingerprintVisitorQueryData {
  isLoading: boolean
  isFetched: boolean
  data: GetResult | undefined
  error: Error | undefined
}
