import type { StartOptions } from '@fingerprint/agent'

export const getOptions = (
  options: StartOptions,
  integrationInfoPackageName: string,
  version: string
): StartOptions => {
  return {
    ...options,
    integrationInfo: [...(options.integrationInfo ?? []), `${integrationInfoPackageName}/${version}`],
  }
}
