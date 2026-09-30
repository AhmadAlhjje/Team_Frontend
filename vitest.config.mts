import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/** Unit & component tests (`*.test.ts(x)`). Component tests opt into jsdom per file. */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: { 'server-only': fileURLToPath(new URL('./test/stubs/server-only.ts', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**'],
    setupFiles: ['./vitest.setup.ts'],
    restoreMocks: true,
  },
});
