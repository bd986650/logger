import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' }
            ],
            // typescript-eslint rules
            '@typescript-eslint/no-explicit-any': 'warn',
            'eqeqeq': ['error', 'always'],
            // style rules
            'curly': ['error', 'all'],
            'semi': ['error', 'always'],
            'quotes': ['error', 'single']
        }
    },
    prettier
];
