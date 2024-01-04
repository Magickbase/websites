/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking'],
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
      },
    },
  ],
  plugins: ['@typescript-eslint'],
  extends: ['next/core-web-vitals', 'prettier', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],
    'import/newline-after-import': 'error',
  },
}

module.exports = config
