import { inject, onMounted, ref } from 'vue'
import { GET_VISITOR_DATA } from '../symbols'
import type { GetOptions, GetResult } from '@fingerprint/agent'
import type { UseGetVisitorDataResult, UseVisitorDataOptions } from './useVisitorData.types'

/**
 * Composition API for fetching visitor data.
 *
 * @example
 * ```typescript
 * setup() {
 *   const { data, getData, isLoading, isFetched, error } = useVisitorData()
 *
 *   // Or with options:
 *   // const { data, getData, isLoading, isFetched, error } = useVisitorData({ immediate: false, tag: 'my-tag' })
 * }
 * ```
 */
export function useVisitorData({
  immediate = true,
  ...getOptionsDefaults
}: UseVisitorDataOptions = {}): UseGetVisitorDataResult {
  const data = ref<GetResult | undefined>()
  const isLoading = ref(false)
  const isFetched = ref(false)
  const currentError = ref<Error | undefined>()

  const getVisitorData = inject(GET_VISITOR_DATA)

  if (!getVisitorData) {
    throw new Error('GET_VISITOR_DATA inject data is missing, perhaps you forgot to install the plugin first?')
  }

  const getData = async (options?: GetOptions): Promise<GetResult> => {
    isLoading.value = true
    isFetched.value = false

    try {
      const mergedOptions: GetOptions = { ...getOptionsDefaults, ...options }
      const result = await getVisitorData(mergedOptions)

      data.value = result
      currentError.value = undefined
      isFetched.value = true

      return result
    } catch (error) {
      data.value = undefined
      isFetched.value = false

      currentError.value = error instanceof Error ? error : new Error(String(error))

      throw error
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    if (immediate) {
      try {
        await getData()
      } catch {
        // getData re-throws so manual callers can handle errors themselves.
        // Here we swallow the error to avoid an unhandled rejection — it's already stored in the error ref.
      }
    }
  })

  return {
    getData,
    data,
    isLoading,
    isFetched,
    error: currentError,
  }
}
