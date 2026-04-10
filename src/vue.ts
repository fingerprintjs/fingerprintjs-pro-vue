import type { FingerprintVueGlobalClient } from './types'
import type { FingerprintVueMixins } from './mixins/mixins.types'

declare module 'vue' {
  interface ComponentCustomProperties extends Partial<FingerprintVueMixins> {
    $fingerprint: FingerprintVueGlobalClient
  }
}

export {}
