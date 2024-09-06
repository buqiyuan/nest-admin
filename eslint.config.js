const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  typescript: true,
}, {
  rules: {
    'no-console': 'off',
    'unused-imports/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 2,

    'ts/consistent-type-imports': 'off',
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'regexp/no-contradiction-with-assertion': 'off',
    'ts/no-unused-expressions': 'off',
  },
})
