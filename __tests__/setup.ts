import { vi, type Mock } from 'vitest'

// Explicit Mock<> annotations keep vite-plugin-dts from emitting TS2742 when
// scanning these test-only exports — without them the inferred types reference
// @vitest/spy through a pnpm virtual path that tsc reports as non-portable.
export const mockGet: Mock<() => Promise<unknown>> = vi.fn()
export const mockStart: Mock<(options?: unknown) => { get: typeof mockGet }> = vi.fn((options?: unknown) => {
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
