import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx,js,jsx}'],
            // Nothing is excluded. The only uncovered files are the composition
            // roots — src/cli.ts and src/cli/module.ts — which just wire the
            // adapters together and are exercised by running the CLI itself.
            thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            },
        },
    },
});
