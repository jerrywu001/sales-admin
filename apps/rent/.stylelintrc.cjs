// https://stylelint.io/user-guide/get-started
// 执行npx stylelint **/*.{css,less,scss,vue} 进行校验

module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
  ],
  // rule覆盖（根据自己喜好来配置）
  rules: {
    'color-function-alias-notation': 'with-alpha',
    'at-rule-no-unknown': null,
    'at-rule-no-deprecated': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'property-no-vendor-prefix': null,
    'custom-property-pattern': null,
    'color-hex-length': 'short',
    'color-function-notation': null,
    'alpha-value-notation': null,
    'value-no-vendor-prefix': null,
    'selector-class-pattern': null,
    'function-url-quotes': null,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
  },
  overrides: [
    // 若项目中存在scss文件，添加以下配置
    {
      files: '**/*.scss',
      customSyntax: 'postcss-scss',
    },
    // 若项目中存在less文件，添加以下配置
    {
      files: '**/*.less',
      customSyntax: 'postcss-less',
    },
  ]
};
