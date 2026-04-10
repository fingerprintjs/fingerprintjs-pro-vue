import type { GetOptions } from '@fingerprint/agent'
import type { FingerprintVisitorQueryData } from '../types'
import type { FingerprintGetVisitorDataMethod } from './mixins.types'

function setMixinData<Key extends keyof FingerprintVisitorQueryData>(
  this: any,
  key: Key,
  value: FingerprintVisitorQueryData[Key]
) {
  this.$data.visitorData[key] = value
}

const getVisitorData: FingerprintGetVisitorDataMethod = async function (options) {
  /**
   * We use this.$root as a fallback, because in nuxt sometimes this.$fingerprint might be empty, but it might exist in $root
   */
  const fingerprint = this.$fingerprint ?? this.$root?.$fingerprint

  if (!fingerprint) {
    throw new TypeError('$fingerprint is not defined.')
  }

  const setData = setMixinData.bind(this)

  try {
    setData('isLoading', true)
    setData('isFetched', false)
    setData('error', undefined)
    setData('data', await fingerprint.getVisitorData(options))
    setData('isFetched', true)
  } catch (error) {
    setData('data', undefined)
    setData('error', error instanceof Error ? error : new Error(String(error)))
    setData('isFetched', false)
  } finally {
    setData('isLoading', false)
  }
}

/**
 * Mixin for fetching visitor data
 *
 * @example ```vue
 * <script>
 * import { fingerprintGetVisitorDataMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v3';
 *
 * export default {
 *   mixins: [fingerprintGetVisitorDataMixin],
 *   async mounted() {
 *     await this.$getVisitorData();
 *   }
 * };
 * </script>
 *
 * <template>
 *   <div>
 *     <button @click='$getVisitorData'>Get visitor data</button>
 *     <span v-if='visitorData.isLoading'>Loading...</span>
 *     <span v-else-if='visitorData.error'>Error: {{ visitorData.error }}</span>
 *     <span v-else>{{ visitorData.data }}</span>
 *   </div>
 * </template>
 * ```
 */
export const fingerprintGetVisitorDataMixin = {
  data() {
    return {
      visitorData: {
        isLoading: false,
        isFetched: false,
        data: undefined,
        error: undefined,
      } as FingerprintVisitorQueryData,
    }
  },
  methods: {
    $getVisitorData: getVisitorData as (options?: GetOptions) => Promise<void>,
  },
}
