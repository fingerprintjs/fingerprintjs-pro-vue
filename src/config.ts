import type { FpjsSpaOptions } from '@fingerprintjs/fingerprintjs-pro-spa'

export const getOptions = (options: FpjsSpaOptions, packageName: string, version: string) => {
  const loadOptions = {
    ...(options?.loadOptions ?? {}),
    integrationInfo: [...(options.loadOptions?.integrationInfo ?? []), `${packageName}/${version}`],
  } as FpjsSpaOptions['loadOptions']

  const clientOptions: FpjsSpaOptions = {
    ...options,
    loadOptions,
  }
  return clientOptions
}
