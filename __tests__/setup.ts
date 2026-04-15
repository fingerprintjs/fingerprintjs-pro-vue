import { vi, type Mock } from 'vitest'

export const mockGet: Mock<[], Promise<unknown>> = vi.fn()
export const mockStart: Mock<[options?: unknown], { get: typeof mockGet }> = vi.fn((options?: unknown) => {
  void options

  return {
    get: mockGet,
  }
})

vi.mock('@fingerprint/agent', async () => {
  const actual = await vi.importActual('@fingerprint/agent')
  return {
    ...actual,
    start: mockStart,
  }
})
