const globals = require('globals');
const pluginJs = require('@eslint/js');

module.exports = {
    ...pluginJs.configs.recommended,
    languageOptions: { globals: globals.node },
    rules: {
        'eqeqeq': ['error', 'always'],
        'no-console': 'warn',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'no-undef': 'error',
        'no-shadow': 'error',
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'prefer-const': 'error',
        'arrow-spacing': ['error', { before: true, after: true }],
        'object-shorthand': ['error', 'always'],
        'prefer-template': 'error',
        'camelcase': ['error', { properties: 'never' }],
        'id-length': ['warn', { min: 2, max: 20 }],
        'no-var': 'error',
        'func-names': ['error', 'always'],
    },
};
