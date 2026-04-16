import { type MockInstance, vi } from 'vitest'

export const mockGet: MockInstance = vi.fn()
export const mockStart: MockInstance = vi.fn(() => ({
  get: mockGet,
}))

vi.mock('@fingerprint/agent', async () => {
  const actual = await vi.importActual('@fingerprint/agent')
  return {
    ...actual,
    start: mockStart,
  }
})
