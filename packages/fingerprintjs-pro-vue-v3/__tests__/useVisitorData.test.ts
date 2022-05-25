import { config, mount } from '@vue/test-utils';
import { fpjsPlugin } from '../src/plugin';
import { FpjsVueOptions } from '../../shared/src/types';
import { useVisitorData } from '../src';
import { onMounted, ref, watch } from 'vue';
import { getVisitorData, init } from './setup';

const apiKey = 'API_KEY';
const testData = {
  visitorId: '#visitor_id',
};

const pluginConfig = {
  loadOptions: {
    apiKey,
  },
} as FpjsVueOptions;

describe('useVisitorData', () => {
  beforeAll(() => {
    config.global.plugins.push([fpjsPlugin, pluginConfig]);
  });

  beforeEach(() => {
    getVisitorData.mockClear();
    init.mockClear();
  });

  it('should expose fpjs related methods', () => {
    mount({
      template: '<h1>Hello world</h1>',
      setup() {
        const { data, getData, isLoading, error } = useVisitorData({ extendedResult: true }, { immediate: false });

        expect(data.value).toBeUndefined();
        expect(typeof getData === 'function').toEqual(true);
        expect(error.value).toBeUndefined();
        expect(isLoading.value).toEqual(false);
      },
    });
  });

  it('should call getData on mount by default', async () => {
    getVisitorData.mockResolvedValue(testData);

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { isLoading, data } = useVisitorData({ extendedResult: true });

          onMounted(() => {
            expect(isLoading.value).toEqual(true);
            expect(init).toHaveBeenCalledTimes(1);
          });

          watch(isLoading, (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading) {
              expect(data.value).toEqual(testData);

              resolve();
            }
          });
        },
      });
    });
  });

  it('should expose errors', async () => {
    const testError = new Error('Test error');

    getVisitorData.mockRejectedValue(testError);

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { isLoading, data, error } = useVisitorData({ extendedResult: true });

          onMounted(() => {
            expect(isLoading.value).toEqual(true);
          });

          watch(isLoading, (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading) {
              expect(data.value).toBeFalsy();
              expect(error.value).toBeTruthy();

              expect(error.value?.name).toEqual('FPJSAgentError');
              expect(error.value?.message).toEqual(testError.message);

              resolve();
            }
          });
        },
      });
    });
  });

  it('should provide fresh data after error', async () => {
    getVisitorData.mockRejectedValueOnce(new Error('Test error'));

    await new Promise<void>((resolve) => {
      mount({
        template: '<h1>Hello world</h1>',
        setup() {
          const { isLoading, getData, error, data } = useVisitorData({ extendedResult: true }, { immediate: true });

          const didRefetch = ref(false);
          const checkedError = ref(false);

          onMounted(() => {
            expect(isLoading.value).toEqual(true);
          });

          watch(isLoading, async (currentLoading, wasLoading) => {
            if (!currentLoading && wasLoading && !checkedError.value) {
              expect(error.value).toBeTruthy();

              checkedError.value = true;

              getVisitorData.mockResolvedValue(testData);

              await getData();

              didRefetch.value = true;

              resolve();
            }
          });

          watch(didRefetch, (value) => {
            if (value) {
              expect(data.value).toEqual(testData);
              expect(error.value).toBeUndefined();

              resolve();
            }
          });
        },
      });
    });
  });

  it('should not call getData if "immediate" is set to false', () => {
    mount({
      template: '<h1>Hello world</h1>',
      setup() {
        const { isLoading } = useVisitorData({ extendedResult: true }, { immediate: false });

        onMounted(() => {
          expect(isLoading.value).toEqual(false);
        });
      },
    });
  });
});
