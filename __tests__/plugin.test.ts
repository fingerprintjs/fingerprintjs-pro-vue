import { config, mount } from '@vue/test-utils'
import { fpjsPlugin, FpjsVueOptions } from '../src'
import { getVisitorData } from '../src/tests/setup'

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
        expect(this.$fpjs).toBeDefined()
        expect(this.$fpjs).toMatchInlineSnapshot(`
Object {
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
        const result = await this.$fpjs.getVisitorData()

        expect(result).toEqual(testData)
      },
    })

    const result = await vm.$fpjs.getVisitorData()

    expect(result).toEqual(testData)
  })
})
