import { config, mount } from '@vue/test-utils'
import { fpjsPlugin } from '../src/plugin'
import { FpjsVueOptions } from '../src/types'
import { UseGetVisitorDataResult, useVisitorData } from '../src'
import { onMounted, ref, watch } from 'vue'
import { getVisitorData, init } from '../src/tests/setup'

const apiKey = 'API_KEY'
const testData = {
  visitorId: '#visitor_id',
}

const pluginConfig = {
  loadOptions: {
    apiKey,
  },
} as FpjsVueOptions

describe('useVisitorData', () => {
  beforeAll(() => {
    config.global.plugins.push([fpjsPlugin, pluginConfig])
  })

  beforeEach(() => {
    getVisitorData.mockClear()
    init.mockClear()
  })

  it('should expose fpjs related methods', () => {
    mount({
      template: '<h1>Hello world</h1>',
      setup() {
        const { data, getData, isLoading, error } = useVisitorData({ extendedResult: true }, { immediate: false })

        expect(data.value).toBeUndefined()
        expect(typeof getData === 'function').toEqual(true)
        expect(error.value).toBeUndefined()
        expect(isLoading.value).toEqual(false)
      },
    })
  })

  it('should call getData on mount by default', async () => {
    getVisitorData.mockResolvedValue(testData)

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { isLoading, data } = useVisitorData({ extendedResult: true })

          onMounted(() => {
            expect(isLoading.value).toEqual(true)
            expect(init).toHaveBeenCalledTimes(1)
          })

          watch(isLoading, (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading) {
              expect(data.value).toEqual(testData)

              resolve()
            }
          })
        },
      })
    })
  })

  it('should expose errors', async () => {
    const testError = new Error('Test error')

    getVisitorData.mockRejectedValue(testError)

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { isLoading, data, error } = useVisitorData({ extendedResult: true })

          onMounted(() => {
            expect(isLoading.value).toEqual(true)
          })

          watch(isLoading, (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading) {
              expect(data.value).toBeFalsy()
              expect(error.value).toBeTruthy()

              expect(error.value?.name).toEqual('FPJSAgentError')
              expect(error.value?.message).toEqual(testError.message)

              resolve()
            }
          })
        },
      })
    })
  })

  it('should provide fresh data after error', async () => {
    getVisitorData.mockRejectedValueOnce(new Error('Test error'))

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { isLoading, getData, error, data } = useVisitorData({ extendedResult: true }, { immediate: true })

          const didRefetch = ref(false)
          const checkedError = ref(false)

          onMounted(() => {
            expect(isLoading.value).toEqual(true)
          })

          watch(isLoading, async (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading && !checkedError.value) {
              expect(error.value).toBeTruthy()

              checkedError.value = true

              getVisitorData.mockResolvedValue(testData)

              await getData()

              didRefetch.value = true

              resolve()
            }
          })

          watch(didRefetch, (value) => {
            if (value) {
              expect(data.value).toEqual(testData)
              expect(error.value).toBeUndefined()

              resolve()
            }
          })
        },
      })
    })
  })

  it('should not call getData if "immediate" is set to false', () => {
    mount({
      template: '<h1>Hello world</h1>',
      setup() {
        const { isLoading } = useVisitorData({ extendedResult: true }, { immediate: false })

        onMounted(() => {
          expect(isLoading.value).toEqual(false)
        })
      },
    })
  })

  describe('Cache', () => {
    function assertIgnoredCache(result: UseGetVisitorDataResult<true>) {
      return new Promise<void>((resolve) => {
        watch(result.isLoading, (currentLoading, wasLoading) => {
          if (!currentLoading && wasLoading) {
            expect(result.data.value).toEqual(testData)

            expect(getVisitorData).toHaveBeenCalledTimes(1)
            expect(getVisitorData).toHaveBeenCalledWith({ extendedResult: true }, true)

            resolve()
          }
        })
      })
    }

    function assertNotIgnoredCache(result: UseGetVisitorDataResult<true>) {
      return new Promise<void>((resolve) => {
        watch(result.isLoading, (currentLoading, wasLoading) => {
          if (!currentLoading && wasLoading) {
            expect(result.data.value).toEqual(testData)

            expect(getVisitorData).toHaveBeenCalledTimes(1)
            expect(getVisitorData).toHaveBeenCalledWith({ extendedResult: true }, false)

            resolve()
          }
        })
      })
    }

    it('should ignore cache if ignoreCache is set to true in useVisitorData', () => {
      getVisitorData.mockResolvedValue(testData)

      return new Promise<void>((resolve, reject) => {
        mount({
          template: '<h1>Hello world</h1>',
          setup() {
            const result = useVisitorData({ extendedResult: true, ignoreCache: true }, { immediate: true })

            assertIgnoredCache(result).then(resolve).catch(reject)
          },
        })
      })
    })

    it('should ignore cache if it is set to true in getData call', () => {
      getVisitorData.mockResolvedValue(testData)

      return new Promise<void>((resolve, reject) => {
        mount({
          template: '<h1>Hello world</h1>',
          setup() {
            const result = useVisitorData({ extendedResult: true, ignoreCache: false }, { immediate: false })

            onMounted(() => {
              result.getData({ ignoreCache: true })
            })

            assertIgnoredCache(result).then(resolve).catch(reject)
          },
        })
      })
    })

    it('should not ignore cache if it is set to ignore in useVisitorData and overwritten in getData call', () => {
      getVisitorData.mockResolvedValue(testData)

      return new Promise<void>((resolve, reject) => {
        mount({
          template: '<h1>Hello world</h1>',
          setup() {
            const result = useVisitorData({ extendedResult: true, ignoreCache: true }, { immediate: false })

            onMounted(() => {
              result.getData({ ignoreCache: false })
            })

            assertNotIgnoredCache(result).then(resolve).catch(reject)
          },
        })
      })
    })
  })
})
