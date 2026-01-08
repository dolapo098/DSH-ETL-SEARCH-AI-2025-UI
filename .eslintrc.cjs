module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    'src/types/vuex.d.ts'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  plugins: [
    '@typescript-eslint',
    'vue',
    'import'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'import/order': 'off',
    'import/no-duplicates': 'off',
    'vue/attributes-order': 'off',
    'vue/attribute-hyphenation': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'padding-line-between-statements': 'off',
    'quotes': ['error', 'double', { 'avoidEscape': true }],
    'indent': ['error', 'tab']
  }
};

