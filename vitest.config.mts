import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      provider: 'istanbul',
      reporter: [['text', { file: 'coverage.txt' }], ['json'], ['json-summary'], ['lcov']],
      reportsDirectory: './coverage',
    },
    environment: 'jsdom',
    include: ['__tests__/**/*.test.{ts,tsx}'],
    globals: false,
    passWithNoTests: false,
    setupFiles: ['./__tests__/setup.ts'],
  },
})
