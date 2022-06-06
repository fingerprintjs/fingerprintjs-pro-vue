import { createLocalVue, mount } from '@vue/test-utils';
import { fpjsPlugin, FpjsVueOptions } from '../src';
import { getVisitorData } from 'shared/tests/setup';

const apiKey = 'API_KEY';
const testData = {
  visitorId: '#visitor_id',
};

const pluginConfig = {
  loadOptions: {
    apiKey,
  },
} as FpjsVueOptions;

let localVue: ReturnType<typeof createLocalVue>;

describe('fpjsPlugin', () => {
  beforeAll(() => {
    localVue = createLocalVue();

    localVue.use(fpjsPlugin, pluginConfig);
  });

  beforeEach(() => {
    getVisitorData.mockClear();
  });

  it('should expose global properties', () => {
    const { vm } = mount(
      {
        template: '<h1>Hello world</h1>',
      },
      {
        localVue,
      }
    );

    expect(vm.$fpjs).toBeTruthy();
  });

  it('should support fetching data using global properties', async () => {
    getVisitorData.mockResolvedValue(testData);

    const { vm } = mount(
      {
        template: '<h1>Hello world</h1>',
      },
      { localVue }
    );

    const result = await vm.$fpjs?.getVisitorData();

    expect(result).toEqual(testData);
  });
});
