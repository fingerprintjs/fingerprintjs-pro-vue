import type { VisitorData } from '@fingerprintjs/fingerprintjs-pro-spa';
import type { Ref } from 'vue';

export interface UseVisitorDataConfig {
  /**
   * Determines whether the `getData()` method will be called immediately after function is called or not
   *
   * @default true
   */
  immediate?: boolean;
}

export interface GetDataOptions {
  /**
   * Determines whether the method should ignore cache
   *
   * @default false
   * */
  ignoreCache?: boolean;
}

export interface UseGetVisitorDataResult<TExtended extends boolean> {
  data: Ref<VisitorData<TExtended> | undefined>;
  error: Ref<Error | undefined>;
  isLoading: Ref<boolean>;
  getData: (options?: GetDataOptions) => Promise<VisitorData<TExtended> | undefined>;
}
