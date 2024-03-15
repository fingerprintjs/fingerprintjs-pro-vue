import type { FpjsVueGlobalClient } from './types'
import type { FpjsVueMixins } from './mixins/mixins.types'

declare module 'vue' {
  interface ComponentCustomProperties extends Partial<FpjsVueMixins> {
    $fpjs: FpjsVueGlobalClient
  }
}
