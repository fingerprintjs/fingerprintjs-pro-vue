import { config, mount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { FingerprintPlugin } from '../src/plugin'
import type { FingerprintPluginOptions } from '../src/types'
import { useVisitorData } from '../src'
import { onMounted, ref, watch } from 'vue'
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
            await getData({ tag: 'test', linkedId: 'link123' })
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
})
