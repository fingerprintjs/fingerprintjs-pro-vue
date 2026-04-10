import type { StartOptions } from '@fingerprint/agent'

export const getOptions = (options: StartOptions, packageName: string, version: string): StartOptions => {
  return {
    ...options,
    integrationInfo: [...(options.integrationInfo ?? []), `${packageName}/${version}`],
  }
}
