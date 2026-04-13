import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { fingerprintGetVisitorDataMixin } from '../src'
import { defineComponent } from 'vue'
import { wait } from '../src/utils'
import { deferred, mountWithPlugin, testData } from './helpers'
import { mockGet, mockStart } from './setup'

function mountMixinComponent() {
  return mountWithPlugin({
    mixins: [fingerprintGetVisitorDataMixin],
    template: '<h1>hello world</h1>',
  })
}

describe('fingerprintGetVisitorDataMixin', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockStart.mockClear()
  })

  it('fetches visitor data and updates state through loading and success', async () => {
    const pending = deferred<typeof testData>()
    mockGet.mockReturnValueOnce(pending.promise)

    const { vm } = mountMixinComponent()

    expect(vm.$getVisitorData).toBeDefined()
    expect(vm.visitorData).toEqual({
      data: undefined,
      error: undefined,
      isFetched: false,
      isLoading: false,
    })

    const request = vm.$getVisitorData?.()

    expect(vm.visitorData).toEqual({
      data: undefined,
      error: undefined,
      isFetched: false,
      isLoading: true,
    })

    pending.resolve(testData)
    await wait(0)
    await request

    expect(vm.visitorData).toEqual({
      data: testData,
      error: undefined,
      isFetched: true,
      isLoading: false,
    })
  })

  it('reuses the same agent across multiple mixin instances', async () => {
    mockGet.mockResolvedValue(testData)

    const Child = defineComponent({
      mixins: [fingerprintGetVisitorDataMixin],
      template: '<h1>hello world</h1>',
    })

    const wrapper = mountWithPlugin({
      components: { Child },
      template: '<div><Child ref="first" /><Child ref="second" /></div>',
    })

    const first = wrapper.getComponent({ ref: 'first' }).vm
    const second = wrapper.getComponent({ ref: 'second' }).vm

    await first.$getVisitorData()
    await second.$getVisitorData({ tag: 'second-instance' })

    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockStart).toHaveBeenCalledTimes(1)
  })

  it('stores errors without marking the fetch as complete', async () => {
    const testError = new Error('Test error')
    mockGet.mockRejectedValue(testError)

    const { vm } = mountMixinComponent()

    await vm.$getVisitorData?.()

    expect(vm.visitorData).toEqual({
      data: undefined,
      error: testError,
      isFetched: false,
      isLoading: false,
    })
  })

  it('normalizes non-Error rejections into Error objects', async () => {
    mockGet.mockRejectedValue('Test error')

    const { vm } = mountMixinComponent()

    await vm.$getVisitorData?.()

    const { visitorData } = vm

    if (!visitorData) {
      throw new Error('Expected visitorData to be defined')
    }

    expect(visitorData.error).toBeInstanceOf(Error)
    expect(visitorData.error?.message).toBe('Test error')
    expect(visitorData.isFetched).toBe(false)
  })

  it('passes options to getVisitorData', async () => {
    mockGet.mockResolvedValue(testData)

    const { vm } = mountMixinComponent()

    await vm.$getVisitorData?.({ tag: 'test-tag', linkedId: 'link123' })

    expect(mockGet).toHaveBeenCalledWith({ tag: 'test-tag', linkedId: 'link123' })
  })

  it('throws when the plugin is missing', async () => {
    const { vm } = mount({
      mixins: [fingerprintGetVisitorDataMixin],
      template: '<h1>hello world</h1>',
    })

    await expect(vm.$getVisitorData?.()).rejects.toThrow('$fingerprint is not defined.')
  })
})
