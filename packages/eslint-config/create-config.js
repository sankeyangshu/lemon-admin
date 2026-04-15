import antfu from '@antfu/eslint-config';

export default function createConfig(options, ...userConfigs) {
  return antfu(
    {
      typescript: true,
      formatters: true,
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },
      ...options,
    },
    {
      rules: {
        'style/arrow-parens': ['error', 'always'], // 箭头函数参数始终添加括号
        'style/brace-style': ['error', '1tbs', { allowSingleLine: true }], // 括号样式
      },
    },
    ...userConfigs,
  );
}
