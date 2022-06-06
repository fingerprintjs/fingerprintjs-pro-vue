import type { FpjsVisitorQueryData } from 'shared/types';
import type { FpjsGetVisitorDataMethod } from 'shared/mixins.types';
import { GetVisitorDataMethodParams } from 'shared/mixins.types';

function setMixinData<Key extends keyof FpjsVisitorQueryData<boolean>>(
  this: any,
  dataName: string,
  key: Key,
  value: FpjsVisitorQueryData<boolean>[Key]
) {
  this.$data[dataName][key] = value;
}

export function createMixin<TExtended extends boolean>(extended: TExtended) {
  const suffix = extended ? 'Extended' : '';

  const name = `$visitorData${suffix}` as const;
  const dataName = `${name.slice(1)}` as 'visitorData' | 'visitorDataExtended';
  const methodName = `$getVisitorData${suffix}` as const;

  const getVisitorData: FpjsGetVisitorDataMethod = async function (options) {
    /**
     * We use this.$root as a fallback, because in nuxt sometimes this.$fpjs might be empty, but it might exist in $root
     * */
    const fpjs = this.$fpjs ?? this.$root?.$fpjs;
    const boundSetData = setMixinData.bind(this);

    const setData = <Key extends keyof FpjsVisitorQueryData<TExtended>>(
      key: Key,
      value: FpjsVisitorQueryData<TExtended>[Key]
    ) => {
      return boundSetData(dataName, key, value);
    };

    if (!fpjs) {
      throw new TypeError('$fpjs is not defined.');
    }

    try {
      setData('isLoading', true);

      setData(
        'data',
        await fpjs.getVisitorData(
          {
            ...(options ?? {}),
            extendedResult: extended,
          },
          options?.ignoreCache
        )
      );
    } catch (error) {
      setData('error', error as Error);
    } finally {
      setData('isLoading', false);
    }
  };

  return {
    data() {
      return {
        [dataName]: {
          isLoading: false,
          data: undefined,
          error: undefined,
        } as FpjsVisitorQueryData<TExtended>,
      };
    },
    methods: {
      [methodName]: getVisitorData as (options?: GetVisitorDataMethodParams) => Promise<void>,
    },
  } as const;
}

// TODO Add jsdoc examples
export const fpjsGetVisitorDataMixin = createMixin(false);
export const fpjsGetVisitorDataExtendedMixin = createMixin(true);
