import type { GetOptions } from '@fingerprint/agent'
import type { FingerprintVisitorQueryData, FingerprintVueGlobalClient } from '../types'

export type FingerprintGetVisitorDataMethodThis = {
  $root?: {
    $fingerprint?: FingerprintVueGlobalClient
  }
  $fingerprint?: FingerprintVueGlobalClient
}

export type FingerprintGetVisitorDataMethod<This = FingerprintGetVisitorDataMethodThis> = (
  this: This,
  options?: GetOptions
) => Promise<void>

export interface FingerprintVueMixins {
  /**
   * Method for fetching visitor data
   */
  $getVisitorData: FingerprintGetVisitorDataMethod<any>

  /**
   * Query state for visitor data
   */
  visitorData: FingerprintVisitorQueryData
}
