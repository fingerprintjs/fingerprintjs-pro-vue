import type { FpjsClientOptions } from '@fingerprintjs/fingerprintjs-pro-spa';

export const getOptions = (options: FpjsClientOptions, packageName: string, version: string) => {
  const clientOptions: FpjsClientOptions = {
    ...options,
    loadOptions: {
      ...options.loadOptions,
      integrationInfo: [...(options.loadOptions?.integrationInfo ?? []), `${packageName}/${version}`],
    },
  };
  return clientOptions;
};
