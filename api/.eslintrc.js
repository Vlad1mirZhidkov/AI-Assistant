module.exports = {
    env: {
      browser: true,
      node: true,  // For Node.js globals
      es6: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: [
      'react',
      '@typescript-eslint',
    ],
    settings: {
      react: {
        version: 'detect',  // Automatically detect the React version
      },
    },
    rules: {
      // Add custom rules here
      'react/prop-types': 'off',  // Example: turn off prop-types rule
    },
  };
  