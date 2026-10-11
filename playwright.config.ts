import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e/browser', fullyParallel: true, forbidOnly: !!process.env.CI, retries: process.env.CI ? 1 : 0, workers: 2,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://127.0.0.1:4301/NATOS/', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'node scripts/serve-preview.mjs', url: 'http://127.0.0.1:4301/NATOS/', reuseExistingServer: !process.env.CI, timeout: 30000 }
});
