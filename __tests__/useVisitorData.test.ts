import { config, mount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { FingerprintPlugin } from '../src/plugin'
import type { FingerprintPluginOptions } from '../src/types'
import { useVisitorData } from '../src'
import { getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import { mockGet, mockStart } from './setup'

const apiKey = 'API_KEY'
const testData = {
  visitor_id: '#visitor_id',
  event_id: 'event123',
  sealed_result: null,
}

const pluginConfig: FingerprintPluginOptions = {
  apiKey,
}

describe('useVisitorData', () => {
  beforeAll(() => {
    config.global.plugins.push([FingerprintPlugin, pluginConfig])
  })

  beforeEach(() => {
    mockGet.mockClear()
    mockStart.mockClear()
  })

  it('should expose data, getData, isLoading, isFetched, and error', () => {
    mount({
      template: '<h1>Hello world</h1>',
      setup() {
        const { data, getData, isLoading, isFetched, error } = useVisitorData({ immediate: false })

        expect(data.value).toBeUndefined()
        expect(typeof getData === 'function').toBe(true)
        expect(error.value).toBeUndefined()
        expect(isLoading.value).toBe(false)
        expect(isFetched.value).toBe(false)
      },
    })
  })

  it('should call getData on mount by default (immediate=true)', async () => {
    mockGet.mockResolvedValue(testData)

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { isLoading, data, isFetched } = useVisitorData()

          onMounted(() => {
            expect(isLoading.value).toBe(true)
            expect(mockStart).toHaveBeenCalledTimes(1)
          })

          watch(isLoading, (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading) {
              expect(data.value).toEqual(testData)
              expect(isFetched.value).toBe(true)

              resolve()
            }
          })
        },
      })
    })
  })

  it('should reuse the same agent across multiple useVisitorData instances', async () => {
    mockGet.mockResolvedValue(testData)

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const firstVisitorData = useVisitorData({ immediate: false })
          const secondVisitorData = useVisitorData({ immediate: false })

          onMounted(async () => {
            const firstResult = await firstVisitorData.getData()
            const secondResult = await secondVisitorData.getData({ tag: 'second-instance' })

            expect(firstResult).toEqual(testData)
            expect(secondResult).toEqual(testData)
            expect(mockGet).toHaveBeenCalledTimes(2)
            expect(mockStart).toHaveBeenCalledTimes(1)

            resolve()
          })
        },
      })
    })
  })

  it('should reuse the same agent between useVisitorData and $fingerprint.getVisitorData', async () => {
    mockGet.mockResolvedValue(testData)

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { getData } = useVisitorData({ immediate: false })
          const instance = getCurrentInstance()

          if (!instance?.proxy) {
            throw new Error('Expected current component instance')
          }

          const fingerprint = instance.proxy.$fingerprint

          onMounted(async () => {
            const composableResult = await getData()
            const pluginResult = await fingerprint.getVisitorData({ tag: 'plugin-call' })

            expect(composableResult).toEqual(testData)
            expect(pluginResult).toEqual(testData)
            expect(mockGet).toHaveBeenCalledTimes(2)
            expect(mockStart).toHaveBeenCalledTimes(1)

            resolve()
          })
        },
      })
    })
  })

  it('should keep isFetched false on error and expose error', async () => {
    const testError = new Error('Test error')
    mockGet.mockRejectedValue(testError)

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { isLoading, isFetched, error } = useVisitorData()

          onMounted(() => {
            expect(isLoading.value).toBe(true)
            expect(isFetched.value).toBe(false)
          })

          watch(isLoading, (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading) {
              expect(isFetched.value).toBe(false)
              expect(error.value).toBeTruthy()

              resolve()
            }
          })
        },
      })
    })
  })

  it('should reject when getData() fails', async () => {
    const testError = new Error('Test error')
    mockGet.mockRejectedValue(testError)

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { getData, error } = useVisitorData({ immediate: false })

          onMounted(async () => {
            await expect(getData()).rejects.toThrow('Test error')
            expect(error.value).toBeTruthy()
            expect(error.value?.message).toBe('Test error')
            expect(error.value?.name).toBe('Error')

            resolve()
          })
        },
      })
    })
  })

  it('should normalize non-Error failures consistently', async () => {
    mockGet.mockRejectedValue('Test failure')

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { getData, error } = useVisitorData({ immediate: false })

          onMounted(async () => {
            const thrown = await getData().catch((caughtError) => caughtError)

            expect(thrown).toBeInstanceOf(Error)
            expect(thrown.message).toBe('Test failure')
            expect(error.value).toBe(thrown)

            resolve()
          })
        },
      })
    })
  })

  it('should provide fresh data after error recovery', async () => {
    mockGet.mockRejectedValueOnce(new Error('Test error'))

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { isLoading, getData, error, data, isFetched } = useVisitorData({ immediate: true })

          const didRefetch = ref(false)
          const checkedError = ref(false)

          onMounted(() => {
            expect(isLoading.value).toBe(true)
          })

          watch(isLoading, async (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading && !checkedError.value) {
              expect(error.value).toBeTruthy()
              expect(isFetched.value).toBe(false)

              checkedError.value = true

              mockGet.mockResolvedValue(testData)

              await getData()

              didRefetch.value = true

              resolve()
            }
          })

          watch(didRefetch, (value) => {
            if (value) {
              expect(data.value).toEqual(testData)
              expect(error.value).toBeUndefined()
              expect(isFetched.value).toBe(true)

              resolve()
            }
          })
        },
      })
    })
  })

  it('should not call getData if `immediate` is set to false', () => {
    mount({
      template: '<h1>Hello world</h1>',
      setup() {
        const { isLoading } = useVisitorData({ immediate: false })

        onMounted(() => {
          expect(isLoading.value).toBe(false)
          expect(mockGet).not.toHaveBeenCalled()
        })
      },
    })
  })

  it('should pass GetOptions to agent.get()', async () => {
    mockGet.mockResolvedValue(testData)

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { getData, isLoading } = useVisitorData({ immediate: false })

          onMounted(async () => {
            const result = await getData({ tag: 'test', linkedId: 'link123' })
            expect(result).toEqual(testData)
          })

          watch(isLoading, (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading) {
              expect(mockGet).toHaveBeenCalledTimes(1)
              expect(mockGet).toHaveBeenCalledWith({ tag: 'test', linkedId: 'link123' })

              resolve()
            }
          })
        },
      })
    })
  })

  it('should merge default GetOptions from useVisitorData with per-call options', async () => {
    mockGet.mockResolvedValue(testData)

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { getData, isLoading } = useVisitorData({ immediate: false, tag: 'default-tag' })

          onMounted(async () => {
            await getData({ linkedId: 'link456' })
          })

          watch(isLoading, (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading) {
              expect(mockGet).toHaveBeenCalledTimes(1)
              expect(mockGet).toHaveBeenCalledWith({ tag: 'default-tag', linkedId: 'link456' })

              resolve()
            }
          })
        },
      })
    })
  })

  it('should allow per-call options to override default options', async () => {
    mockGet.mockResolvedValue(testData)

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { getData, isLoading } = useVisitorData({ immediate: false, tag: 'default-tag' })

          onMounted(async () => {
            await getData({ tag: 'override-tag' })
          })

          watch(isLoading, (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading) {
              expect(mockGet).toHaveBeenCalledTimes(1)
              expect(mockGet).toHaveBeenCalledWith({ tag: 'override-tag' })

              resolve()
            }
          })
        },
      })
    })
  })

  it('should clear stale error and data immediately when getData() is called again', async () => {
    // First call fails so error/data are populated.
    mockGet.mockRejectedValueOnce(new Error('Test error'))

    // Second call: a deferred promise so we can inspect mid-flight refs before it resolves.
    let resolveSecond!: (value: typeof testData) => void
    mockGet.mockReturnValueOnce(
      new Promise<typeof testData>((resolve) => {
        resolveSecond = resolve
      })
    )

    await new Promise<void>((done) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { getData, error, data, isLoading, isFetched } = useVisitorData({ immediate: true })

          let retried = false

          watch(isLoading, async (current, was) => {
            if (current || !was || retried) {
              return
            }

            // First call has just settled with an error.
            retried = true
            expect(error.value).toBeTruthy()

            // Start the retry but don't await it — we want to assert state mid-flight.
            const pending = getData()

            // Flush the synchronous reset that happens at the top of getData().
            await nextTick()

            expect(isLoading.value).toBe(true)
            expect(error.value).toBeUndefined()
            expect(data.value).toBeUndefined()
            expect(isFetched.value).toBe(false)

            // Resolve the deferred so the test can settle cleanly.
            resolveSecond(testData)
            await pending
            done()
          })
        },
      })
    })
  })
})
