import * as Fingerprint from '@fingerprint/agent'
import { FingerprintPlugin } from './plugin'
import './vue'

export { FingerprintPlugin } from './plugin'
export { GET_VISITOR_DATA } from './symbols'
export type {
  FingerprintPluginOptions,
  GetVisitorData,
  FingerprintVueGlobalClient,
  FingerprintVisitorQueryData,
} from './types'
export type { FingerprintVueMixins } from './mixins/mixins.types'
export { useVisitorData } from './useVisitorData/useVisitorData'
export type { UseGetVisitorDataResult, UseVisitorDataOptions } from './useVisitorData/useVisitorData.types'
export { fingerprintGetVisitorDataMixin } from './mixins/mixins'

export { Fingerprint }

export default FingerprintPlugin
