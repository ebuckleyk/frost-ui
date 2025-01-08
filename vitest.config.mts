import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    include: ['**/*.test.tsx'],
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        'docs-build/*',
        '**/*.config*',
        '**/*.stories.tsx',
        '**/lib/*',
        '**/styles/*',
        '**/hooks/*',
      ],
    },
  },
});
