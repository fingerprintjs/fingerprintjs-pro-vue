import { inject, onMounted, ref } from 'vue';
import { GET_VISITOR_DATA } from './symbols';
import type { GetOptions } from '@fingerprintjs/fingerprintjs-pro';
import type { VisitorData } from '@fingerprintjs/fingerprintjs-pro-spa';
import type { UseGetVisitorDataResult, UseVisitorDataConfig } from './useVisitorData.types';

export function useVisitorData<TExtended extends boolean>(
  options: GetOptions<TExtended> = {},
  { immediate = true }: UseVisitorDataConfig = {}
): UseGetVisitorDataResult<TExtended> {
  const data = ref<VisitorData<TExtended> | undefined>();
  const isLoading = ref(false);
  const currentError = ref<Error | undefined>();

  const getVisitorData = inject(GET_VISITOR_DATA);

  if (!getVisitorData) {
    throw new Error('GET_VISITOR_DATA inject data is missing, perhaps you forgot to install the plugin first?');
  }

  const getData: UseGetVisitorDataResult<TExtended>['getData'] = async (getDataOptions) => {
    isLoading.value = true;

    try {
      const result = await getVisitorData(options, getDataOptions?.ignoreCache);

      data.value = result;

      currentError.value = undefined;

      return result;
    } catch (error) {
      if (error instanceof Error) {
        error.message = `${error.name}: ${error.message}`;
        error.name = 'FPJSAgentError';

        currentError.value = error;
      }

      return undefined;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(async () => {
    if (immediate) {
      await getData();
    }
  });

  return {
    getData,
    data,
    isLoading,
    error: currentError,
  };
}
