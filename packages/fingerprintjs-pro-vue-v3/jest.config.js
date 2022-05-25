const base = require('../../jest.config');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...base,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
};
