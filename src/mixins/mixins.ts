import type { FpjsVisitorQueryData } from '../types'
import type { FpjsGetVisitorDataMethod, GetVisitorDataMethodParams } from './mixins.types'

function setMixinData<Key extends keyof FpjsVisitorQueryData<boolean>>(
  this: any,
  dataName: string,
  key: Key,
  value: FpjsVisitorQueryData<boolean>[Key]
) {
  this.$data[dataName][key] = value
}

function createMixin<TExtended extends boolean>(extended: TExtended) {
  const suffix = extended ? 'Extended' : ''

  const dataName = extended ? 'visitorDataExtended' : 'visitorData'
  const methodName = `$getVisitorData${suffix}` as const

  const getVisitorData: FpjsGetVisitorDataMethod = async function (options) {
    /**
     * We use this.$root as a fallback, because in nuxt sometimes this.$fpjs might be empty, but it might exist in $root
     * */
    const fpjs = this.$fpjs ?? this.$root?.$fpjs
    const boundSetData = setMixinData.bind(this)

    const setData = <Key extends keyof FpjsVisitorQueryData<TExtended>>(
      key: Key,
      value: FpjsVisitorQueryData<TExtended>[Key]
    ) => {
      return boundSetData(dataName, key, value)
    }

    if (!fpjs) {
      throw new TypeError('$fpjs is not defined.')
    }

    try {
      setData('isLoading', true)

      setData(
        'data',
        await fpjs.getVisitorData(
          {
            ...(options ?? {}),
            extendedResult: extended,
          },
          options?.ignoreCache
        )
      )
    } catch (error) {
      setData('error', error as Error)
    } finally {
      setData('isLoading', false)
    }
  }

  return {
    data() {
      return {
        [dataName]: {
          isLoading: false,
          data: undefined,
          error: undefined,
        } as FpjsVisitorQueryData<TExtended>,
      }
    },
    methods: {
      [methodName]: getVisitorData as (options?: GetVisitorDataMethodParams) => Promise<void>,
    },
  } as const
}

/**
 * Mixin for fetching normal visitorData
 *
 * @example ```vue
 *
 * <script>
 * import { fpjsGetVisitorDataMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v3';
 * //import { fpjsGetVisitorDataMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
 *
 * export default {
 *   // Include our mixin
 *   mixins: [fpjsGetVisitorDataMixin],
 *   async mounted() {
 *     // You can also fetch data on mount
 *     // await this.$getVisitorData();
 *   }
 * };
 * </script>
 *
 * <template>
 *   <div>
 *     <button @click='$getVisitorData'>
 *       Get visitor data
 *     </button>
 *     <span v-if='visitorData.isLoading'>
 *       Loading...
 *     </span>
 *     <span v-else-if='visitorData.isError'>
 *       Error: {{ visitorData.error }}
 *     </span>
 *     <span v-else>
 *       <!--Do something with visitorData here-->
 *     </span>
 *   </div>
 * </template>
 * ```
 * */
export const fpjsGetVisitorDataMixin = createMixin(false) as {
  data: () => { visitorData: FpjsVisitorQueryData<false> }
  methods: {
    $getVisitorData: FpjsGetVisitorDataMethod<any>
  }
}

/**
 * Mixin for fetching extended visitorData
 *
 * @example ```vue
 *
 * <script>
 * import { fpjsGetVisitorDataExtendedMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v3';
 * //import { fpjsGetVisitorDataExtendedMixin } from '@fingerprintjs/fingerprintjs-pro-vue-v2';
 *
 * export default {
 *   // Include our mixin
 *   mixins: [fpjsGetVisitorDataExtendedMixin],
 *   async mounted() {
 *     // You can also fetch data on mount
 *     // await this.$getVisitorDataExtended();
 *   }
 * );
 * </script>
 *
 * <template>
 *   <div>
 *     <button @click='$getVisitorDataExtended'>
 *       Get visitor data
 *     </button>
 *     <span v-if='visitorDataExtended.isLoading'>
 *       Loading...
 *     </span>
 *     <span v-else-if='visitorDataExtended.isError'>
 *       Error: {{ visitorDataExtended.error }}
 *     </span>
 *     <span v-else>
 *       <!--Do something with visitorData here-->
 *     </span>
 *   </div>
 * </template>
 * ```
 * */
export const fpjsGetVisitorDataExtendedMixin = createMixin(true) as {
  data: () => { visitorDataExtended: FpjsVisitorQueryData<true> }
  methods: {
    $getVisitorDataExtended: FpjsGetVisitorDataMethod<any>
  }
}
