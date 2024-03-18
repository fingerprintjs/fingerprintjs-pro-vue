/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '/__tests__/.+test.tsx?$',
  collectCoverageFrom: ['./src/**/**.{ts,tsx}'],
  coverageReporters: ['lcov', 'json-summary', ['text', { file: 'coverage.txt', path: './' }]],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
}
