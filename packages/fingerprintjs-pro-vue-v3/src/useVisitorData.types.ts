import type { VisitorData } from '@fingerprintjs/fingerprintjs-pro-spa';
import type { Ref } from 'vue';
import type { FpjsVisitorQueryData, GetDataOptions } from 'shared/types';

type AsRefs<T> = {
  [K in keyof T]: Ref<T[K]>;
};

export type UseGetVisitorDataResult<TExtended extends boolean> = AsRefs<FpjsVisitorQueryData<TExtended>> & {
  getData: (options?: GetDataOptions) => Promise<VisitorData<TExtended> | undefined>;
};
