const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const globals = require('globals');
const betterTailwindcss = require('eslint-plugin-better-tailwindcss');

const betterTailwindcssPlugin = betterTailwindcss.default ?? betterTailwindcss;

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.eslintrc'],
  },
  ...compat.config({
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier', 'jest', 'react-hooks'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
    ],
    env: {
      node: true,
      'jest/globals': true,
    },
    rules: {
      'no-console': 1,
      'prettier/prettier': 2,
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx', '*.js'],
        parser: '@typescript-eslint/parser',
      },
    ],
  }),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'better-tailwindcss': betterTailwindcssPlugin,
    },
    rules: {
      ...betterTailwindcssPlugin.configs['recommended-error'].rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unknown-classes': [
        'error',
        {
          ignore: [
            '^glass-(card|dialog|overlay|popover)$',
            '^cn-.*$',
            '^frostui-.*$',
            '^richtext-.*$',
            '^toaster$',
            '^no-scrollbar$',
            '^origin-top-center$',
          ],
        },
      ],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/frostui.css',
        tsconfig: 'tsconfig.json',
      },
    },
  },
  {
    files: ['**/*.{test,spec}.{js,ts,tsx}', 'tests/**/*.{js,ts,tsx}'],
    languageOptions: {
      globals: globals.jest,
    },
  },
];
