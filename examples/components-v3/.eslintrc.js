module.exports = {
  extends: ['../../.eslintrc.js'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  rules: {
    'vue/max-attributes-per-line': 'off',
  },
}
