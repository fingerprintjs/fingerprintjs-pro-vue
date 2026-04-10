import { vi } from 'vitest'

export const mockGet = vi.fn()
export const mockStart = vi.fn((_options?: any) => ({
  get: mockGet,
}))

vi.mock('@fingerprint/agent', async () => {
  const actual = await vi.importActual('@fingerprint/agent')
  return {
    ...actual,
    start: mockStart,
  }
})
