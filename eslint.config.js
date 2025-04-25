import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['node_modules/'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
  },
  {
    rules: {
      'prettier/prettier': 'error',
      'no-debugger': 'off',
      'no-console': 'warn',
      'eol-last': ['error', 'always'],
      'no-empty': 'warn',
      'no-empty-function': 'warn',
      'no-var': 'error',
      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
          ArrayExpression: 1,
          ObjectExpression: 1,
          ImportDeclaration: 1,
          flatTernaryExpressions: false,
          offsetTernaryExpressions: false,
          ignoredNodes: ['ConditionalExpression'],
        },
      ],
      camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'func-call-spacing': ['error', 'never'],
      'block-spacing': ['error', 'always'],
      'no-trailing-spaces': [
        'error',
        { skipBlankLines: true, ignoreComments: true },
      ],
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: true,
          memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
          allowSeparatedGroups: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@next/next/no-img-element': 'off',
      // react
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/destructuring-assignment': [
        'error',
        'always',
        { ignoreClassFields: true, destructureInSignature: 'always' },
      ],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          shorthandLast: false,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
    },
  },
  { settings: { react: { version: 'detect' } } },
]

export default eslintConfig
