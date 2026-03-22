// @ts-check
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Files and directories to never lint
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      '**/*.astro',
      'src/__mocks__/**',
    ],
  },

  // TypeScript rules for all .ts / .tsx files
  ...tseslint.configs.recommended,

  // React hooks + project-specific overrides
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      // Enforce hooks rules (exhaustive-deps catches missing useEffect deps)
      ...reactHooks.configs.recommended.rules,

      // Require a comment whenever `any` is used (our guidelines require this)
      '@typescript-eslint/no-explicit-any': 'error',

      // Allow _prefixed names to be unused (common for destructuring)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Prettier must be last — disables all formatting rules that conflict
  prettierConfig,
);
