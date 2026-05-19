import { defineConfig, devices } from '@playwright/test';

// Playwright config for the kit's reference site. The test suite covers:
//   - Public page rendering (Puck blocks show up at /)
//   - Admin editor mount (Puck loads at /admin/pages/[slug])
//   - Sveltia mount (/admin/index.html serves)
//   - API auth (POST /api/save-page rejects unauthenticated requests)
//
// Tests run against `npm run dev` started automatically below. Real GitHub
// commits are NOT exercised — the API route is tested only for auth behavior
// and request shape, not the round-trip to GitHub.

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // one server, serialize for sanity
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      // Test-mode env. Real values for production come from .env.local / Vercel.
      EDITOR_SHARED_TOKEN: 'test-secret-token-not-for-production',
      GITHUB_PAT: 'test-not-used',
      GITHUB_REPO: 'test/repo',
      GITHUB_BRANCH: 'main',
    },
  },
});
