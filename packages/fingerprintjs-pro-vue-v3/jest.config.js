const base = require('../../jest.config');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...base,
  setupFilesAfterEnv: ['<rootDir>/../shared/src/tests/setup.ts'],
};
