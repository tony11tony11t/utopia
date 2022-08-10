module.exports = {
    extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-recommended-vue'
    ],
    plugins: [
        'stylelint-order'
    ],
    ignoreFiles: [
        "dist/**/*"
    ],
    overrides: [
        {
            files: ['**/*.(scss|css|html|vue)'],
            customSyntax: 'postcss-scss'
        },
        {
            files: ['**/*.(html|vue)'],
            customSyntax: 'postcss-html'
        }
    ],
}
