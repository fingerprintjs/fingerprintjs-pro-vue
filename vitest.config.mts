import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['lcov', 'json-summary', 'json', ['text', { file: 'coverage.txt' }]],
      reportsDirectory: './coverage',
    },
    environment: 'jsdom',
    include: ['__tests__/**/*.test.{ts,tsx}'],
    globals: false,
    passWithNoTests: false,
    setupFiles: ['./__tests__/setup.ts'],
  },
})
