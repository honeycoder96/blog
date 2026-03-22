import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: {
      // astro:content is a build-time virtual module; mock it for unit tests
      'astro:content': resolve('./src/__mocks__/astro-content.ts'),
    },
  },
});
