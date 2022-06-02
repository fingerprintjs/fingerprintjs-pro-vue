const base = require('../../jest.config');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...base,
  moduleNameMapper: {
    ...base.moduleNameMapper,
    //'^(vue)': '<rootDir>/node_modules/vue/dist/vue.runtime.common.js',
  },
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>../shared/src/tests/setup.ts'],
};
