import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  typescript: true,
  // 现有 README 徽章和 issue 模板过不了 antfu 10 的 markdown 规则。关掉，避免为升级去改文档排版。
  markdown: false,
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
    // antfu 10 新增。现有代码按旧版换行，打开会整库重排。
    'antfu/reasonable-newline': 'off',
    // 不改 pnpm 的 shell 和信任策略来迁就插件默认值。
    'pnpm/yaml-enforce-settings': 'off',
  },
})
