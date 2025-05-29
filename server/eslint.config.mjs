import js from '@eslint/js'
import globals from 'globals'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,cjs}'],
    plugins: {
      js,
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'script', // per CommonJS
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
])
