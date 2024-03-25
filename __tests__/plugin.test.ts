import { config, mount } from '@vue/test-utils'
import { fpjsPlugin, FpjsVueOptions } from '../src'
import '../src/vue'
import { getVisitorData } from './setup'

const apiKey = 'API_KEY'
const testData = {
  visitorId: '#visitor_id',
}

const pluginConfig = {
  loadOptions: {
    apiKey,
  },
} as FpjsVueOptions

describe('fpjsPlugin', () => {
  beforeAll(() => {
    config.global.plugins.push([fpjsPlugin, pluginConfig])
  })

  beforeEach(() => {
    getVisitorData.mockClear()
  })

  it('should expose global properties', () => {
    mount({
      template: '<h1>Hello world</h1>',
      mounted() {
        // Need to cast as any here due to invalid types.
        // It works in normal vue components (check ./examples)
        const $fpjs = (this as any).$fpjs

        expect($fpjs).toBeDefined()
        expect($fpjs).toMatchInlineSnapshot(`
{
  "clearCache": [Function],
  "getVisitorData": [Function],
}
`)
      },
    })
  })

  it('should support fetching data using global properties', async () => {
    getVisitorData.mockResolvedValue(testData)

    const { vm } = mount({
      template: '<h1>Hello world</h1>',
      async mounted() {
        const $fpjs = (this as any).$fpjs
        const result = await $fpjs.getVisitorData()

        expect(result).toEqual(testData)
      },
    })

    const result = await vm.$fpjs.getVisitorData()

    expect(result).toEqual(testData)
  })
})
