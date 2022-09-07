module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
  ],
  plugins: [
    'stylelint-order',
  ],
  ignoreFiles: [
    'dist/**/*',
  ],
  overrides: [
    {
      files: ['**/*.(scss|css|html|vue)'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    'declaration-colon-newline-after': null,
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'string-quotes': "single",
    'at-rule-no-unknown': null,
    'indentation': null,
    'no-descending-specificity': null
  }
};
