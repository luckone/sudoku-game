// eslint.config.js
import pluginVue from 'eslint-plugin-vue'
import airbnbBase from 'eslint-config-airbnb-base'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.{js,ts,vue}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      vue: pluginVue,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.app.json',
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      ...airbnbBase.rules,
      ...pluginVue.configs.recommended.rules,

      // Vue specific rules
      'vue/html-indent': ['error', 2],
      'vue/multi-word-component-names': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/max-attributes-per-line': ['error', {
        singleline: 3,
        multiline: 1
      }],

      // TypeScript rules
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],

      // Customize or disable some Airbnb rules that might conflict with Vue/TS
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'no-param-reassign': ['error', {
        props: true,
        ignorePropertyModificationsFor: ['state'] // for Vuex/Pinia state
      }],
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      'vite.config.ts',
    ],
  },
]
