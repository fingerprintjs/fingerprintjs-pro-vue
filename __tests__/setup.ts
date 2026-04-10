import { vi } from 'vitest'

export const init = vi.fn()
export const getVisitorData = vi.fn()
export const clearCache = vi.fn()

vi.mock('@fingerprintjs/fingerprintjs-pro-spa', async () => {
  return {
    ...((await vi.importActual('@fingerprintjs/fingerprintjs-pro-spa')) as any),
    FpjsClient: vi.fn(() => {
      return {
        init,
        getVisitorData,
        clearCache,
      }
    }),
  }
})
