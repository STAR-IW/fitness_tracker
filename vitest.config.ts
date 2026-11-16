import { defineConfig } from "vitest/config";

// Load test env before anything imports src/config.ts. Variables already set in the shell win,
// and src/config.ts's own loading of .env won't override these either.
process.loadEnvFile(".env.test");

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    globalSetup: ["tests/global-setup.ts"],
    setupFiles: ["tests/setup.ts"],
    // All files share one database, so run them one at a time.
    fileParallelism: false,
  },
});