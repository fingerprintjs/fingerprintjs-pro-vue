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
    mount(
      {
        template: '<h1>Hello world</h1>',
        mounted() {
          expect(this).toBeDefined();
        },
      },
      {
        localVue,
      }
    );
  });

  it('should support fetching data using global properties', async () => {
    getVisitorData.mockResolvedValue(testData);

    await new Promise<void>((resolve) => {
      mount(
        {
          template: '<h1>Hello world</h1>',
          async mounted() {
            const result = await this.$fpjs?.getVisitorData();

            expect(result).toEqual(testData);

            resolve();
          },
        },
        { localVue }
      );
    });
  });
});
