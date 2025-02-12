module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    rules: {
        'semi': ['error', 'always'],
        'quotes': ['error', 'single']
    },
    globals: {
        module: 'readonly'
    }
};
