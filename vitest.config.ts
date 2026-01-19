/**
 * Vitest Configuration
 *
 * Test organization:
 * - Unit tests: src/test/unit/*.test.ts (mocked dependencies, fast)
 * - Integration tests: src/test/integration/*.test.ts (real database, slower)
 *
 * Run all tests: npm test
 * Run once: npm run test:run
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'dist', '**/*.test.ts'],
    },
  },
});
