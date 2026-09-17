import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  {
    ignores: ['playwright-report/**', 'test-results/**', 'network-report/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts', 'playwright.config.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions routinely live inside steps.*/page-object methods rather than the
      // test body (see CLAUDE.md "Writing tests"), which this rule can't see into.
      'playwright/expect-expect': 'off',
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      // Page-object/Steps methods legitimately call expect() outside a test() block
      // (e.g. CartSteps.checkCartContainsItems, LoginSteps.checkLoginError) — this
      // rule assumes spec-file-only usage.
      'playwright/no-standalone-expect': 'off',
    },
  },
  {
    files: ['src/steps/index.ts'],
    rules: {
      // Deliberate TS mixin pattern (class + interface declaration merging) via
      // applyMixins in src/helpers/utils.ts — not an accident.
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    },
  }
);
