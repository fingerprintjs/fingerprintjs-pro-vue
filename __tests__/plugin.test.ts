import { config, mount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { FingerprintPlugin } from '../src'
import type { FingerprintPluginOptions } from '../src'
import '../src/vue'
import { mockGet, mockStart } from './setup'
import * as packageInfo from '../package.json'
import { createApp } from 'vue'

const apiKey = 'API_KEY'
const testData = {
  visitor_id: '#visitor_id',
  event_id: 'event123',
  sealed_result: null,
}

const pluginConfig: FingerprintPluginOptions = {
  apiKey,
}

describe('FingerprintPlugin', () => {
  beforeAll(() => {
    config.global.plugins.push([FingerprintPlugin, pluginConfig])
  })

  beforeEach(() => {
    mockGet.mockClear()
  })

  it('should expose $fingerprint global property with getVisitorData', () => {
    mount({
      template: '<h1>Hello world</h1>',
      mounted() {
        const $fingerprint = (this as any).$fingerprint

        expect($fingerprint).toBeDefined()
        expect($fingerprint.getVisitorData).toBeDefined()
        expect(typeof $fingerprint.getVisitorData).toBe('function')
        // clearCache should not exist
        expect($fingerprint.clearCache).toBeUndefined()
      },
    })
  })

  it('should support fetching data using $fingerprint.getVisitorData()', async () => {
    mockGet.mockResolvedValue(testData)

    const { vm } = mount({
      template: '<h1>Hello world</h1>',
      async mounted() {
        const $fingerprint = (this as any).$fingerprint
        const result = await $fingerprint.getVisitorData()

        expect(result).toEqual(testData)
      },
    })

    const result = await vm.$fingerprint.getVisitorData()

    expect(result).toEqual(testData)
  })

  it('should throw if old loadOptions config shape is used', () => {
    expect(() => {
      const app = createApp({ template: '<div />' })
      app.use(FingerprintPlugin, { loadOptions: { apiKey: 'test' } } as any)
    }).toThrow(/loadOptions/)
  })

  it('should call start() with integrationInfo appended on first getVisitorData call', async () => {
    mockStart.mockClear()
    mockGet.mockResolvedValue(testData)

    const app = createApp({ template: '<div />' })
    app.use(FingerprintPlugin, { apiKey: 'test-key' })

    expect(mockStart).not.toHaveBeenCalled()

    const vm = app.mount(document.createElement('div')) as any
    await vm.$fingerprint.getVisitorData()

    expect(mockStart).toHaveBeenCalledTimes(1)
    const callArgs = mockStart.mock.calls[0][0] as any
    expect(callArgs.apiKey).toBe('test-key')
    expect(callArgs.integrationInfo).toContain(`fingerprintjs-pro-vue-v3/${packageInfo.version}`)
  })

  it('should preserve existing integrationInfo entries', async () => {
    mockStart.mockClear()
    mockGet.mockResolvedValue(testData)

    const app = createApp({ template: '<div />' })
    app.use(FingerprintPlugin, { apiKey: 'test-key', integrationInfo: ['custom/1.0'] })

    const vm = app.mount(document.createElement('div')) as any
    await vm.$fingerprint.getVisitorData()

    expect(mockStart).toHaveBeenCalledTimes(1)
    const callArgs = mockStart.mock.calls[0][0] as any
    expect(callArgs.integrationInfo).toContain('custom/1.0')
    expect(callArgs.integrationInfo).toContain(`fingerprintjs-pro-vue-v3/${packageInfo.version}`)
  })
})
