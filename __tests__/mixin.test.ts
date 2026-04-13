import { config, mount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { FingerprintPlugin, fingerprintGetVisitorDataMixin } from '../src'
import type { FingerprintPluginOptions } from '../src'
import { defineComponent, nextTick } from 'vue'
import { mockGet, mockStart } from './setup'
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
    mockStart.mockClear()
  })

  it('should fetch visitor data and update state through full lifecycle', async () => {
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

  it('should populate data correctly', async () => {
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

  it('should reuse the same agent across multiple mixin instances', async () => {
    mockGet.mockResolvedValue(testData)

    const Child = defineComponent({
      mixins: [fingerprintGetVisitorDataMixin],
      template: '<h1>hello world</h1>',
    })

    const wrapper = mount({
      components: { Child },
      template: '<div><Child ref="first" /><Child ref="second" /></div>',
    })

    const first = wrapper.getComponent({ ref: 'first' }).vm
    const second = wrapper.getComponent({ ref: 'second' }).vm

    await first.$getVisitorData?.()
    await second.$getVisitorData?.({ tag: 'second-instance' })

    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockStart).toHaveBeenCalledTimes(1)
  })

  it('should handle errors correctly', async () => {
    const testError = new Error('Test error')
    mockGet.mockRejectedValue(testError)

    const { vm } = mount({
      mixins: [fingerprintGetVisitorDataMixin],

      template: '<h1>hello world</h1>',
    })

    await vm.$getVisitorData?.()

    expect(vm.visitorData?.data).toBeUndefined()
    expect(vm.visitorData?.error).toEqual(testError)
    expect(vm.visitorData?.isFetched).toBe(false)
    expect(vm.visitorData?.isLoading).toBe(false)
  })

  it('should pass options to getVisitorData', async () => {
    mockGet.mockResolvedValue(testData)

    const { vm } = mount({
      mixins: [fingerprintGetVisitorDataMixin],

      template: '<h1>hello world</h1>',
    })

    await vm.$getVisitorData?.({ tag: 'test-tag', linkedId: 'link123' })

    expect(mockGet).toHaveBeenCalledWith({ tag: 'test-tag', linkedId: 'link123' })
  })

  it('should clear stale data immediately when getVisitorData is called again', async () => {
    mockGet.mockResolvedValueOnce(testData)

    let resolveSecond!: (value: typeof testData) => void
    mockGet.mockReturnValueOnce(
      new Promise<typeof testData>((resolve) => {
        resolveSecond = resolve
      })
    )

    const { vm } = mount({
      mixins: [fingerprintGetVisitorDataMixin],
      template: '<h1>hello world</h1>',
    })

    await vm.$getVisitorData?.()

    expect(vm.visitorData?.data).toEqual(testData)
    expect(vm.visitorData?.isFetched).toBe(true)

    const pending = vm.$getVisitorData?.({ tag: 'retry' })
    await nextTick()

    expect(vm.visitorData?.isLoading).toBe(true)
    expect(vm.visitorData?.data).toBeUndefined()
    expect(vm.visitorData?.error).toBeUndefined()
    expect(vm.visitorData?.isFetched).toBe(false)

    resolveSecond(testData)
    await pending

    expect(vm.visitorData?.data).toEqual(testData)
    expect(vm.visitorData?.isFetched).toBe(true)
  })
})
