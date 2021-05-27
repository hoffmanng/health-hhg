module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        'jest/globals': true
    },
    extends: [
        'airbnb-base'
    ],
    plugins: [
        'jest'
    ],
    parserOptions: { ecmaVersion: 12 },
    rules: {
        indent: ['error', 4],
        'comma-dangle': ['error', 'never'],
        'no-restricted-syntax': 'off',
        'no-await-in-loop': 'off',
        'no-plusplus': 'off',
        'max-len': ['error', { code: 120 }],
        'no-extra-boolean-cast': 'off',
        'arrow-body-style': ['error', 'always'],
        'no-underscore-dangle': ['error', { allow: ['_id'] }],
        radix: ['error', 'as-needed'],
        'object-curly-newline': ['error', { multiline: true }],
        'no-console': 'off'
    }
};
