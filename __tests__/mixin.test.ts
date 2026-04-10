import { config, mount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { FingerprintPlugin, fingerprintGetVisitorDataMixin } from '../src'
import type { FingerprintPluginOptions } from '../src'
import { mockGet } from './setup'
import { wait } from '../src/utils'

const apiKey = 'API_KEY'
const testData = {
  visitor_id: '#visitor_id',
  event_id: 'event123',
  sealed_result: null,
}

const pluginConfig: FingerprintPluginOptions = {
  apiKey,
}

describe('FingerprintPlugin - mixins', () => {
  beforeAll(() => {
    config.global.plugins.push([FingerprintPlugin, pluginConfig])
  })

  beforeEach(() => {
    mockGet.mockClear()
  })

  it('should provide mixin with $getVisitorData method and visitorData state', async () => {
    mockGet.mockImplementation(async () => {
      await wait(400)

      return testData
    })

    const { vm } = mount({
      mixins: [fingerprintGetVisitorDataMixin],

      template: '<h1>hello world</h1>',
    })

    const spy = vi.spyOn(vm.$fingerprint, 'getVisitorData')

    expect(vm.$getVisitorData).toBeDefined()
    expect(vm.visitorData).toBeDefined()
    expect(vm.visitorData).toMatchInlineSnapshot(`
{
  "data": undefined,
  "error": undefined,
  "isFetched": false,
  "isLoading": false,
}
`)

    vm.$getVisitorData?.()

    expect(vm.visitorData?.isLoading).toBe(true)

    await wait(450)

    expect(vm.visitorData).toMatchInlineSnapshot(`
{
  "data": {
    "event_id": "event123",
    "sealed_result": null,
    "visitor_id": "#visitor_id",
  },
  "error": undefined,
  "isFetched": true,
  "isLoading": false,
}
`)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(undefined)
  })

  it('should have correct initial state', () => {
    const { vm } = mount({
      mixins: [fingerprintGetVisitorDataMixin],

      template: '<h1>hello world</h1>',
    })

    expect(vm.visitorData).toEqual({
      isLoading: false,
      isFetched: false,
      data: undefined,
      error: undefined,
    })
  })

  it('should populate data and set isFetched after fetch', async () => {
    mockGet.mockResolvedValue(testData)

    const { vm } = mount({
      mixins: [fingerprintGetVisitorDataMixin],

      template: '<h1>hello world</h1>',
    })

    await vm.$getVisitorData?.()

    expect(vm.visitorData?.data).toEqual(testData)
    expect(vm.visitorData?.isFetched).toBe(true)
    expect(vm.visitorData?.isLoading).toBe(false)
    expect(vm.visitorData?.error).toBeUndefined()
  })

  it('should use $fingerprint global property', () => {
    const { vm } = mount({
      mixins: [fingerprintGetVisitorDataMixin],

      template: '<h1>hello world</h1>',
    })

    expect(vm.$fingerprint).toBeDefined()
    expect(vm.$fingerprint.getVisitorData).toBeDefined()
  })
})
