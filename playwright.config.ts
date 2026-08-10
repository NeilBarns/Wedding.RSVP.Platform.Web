import { defineConfig, devices } from '@playwright/test'
import { apiUrl, frontendUrl, requireApiRepoPath } from './e2e/helpers/env'

const apiRepo = requireApiRepoPath()
const frontend = new URL(frontendUrl)
const api = new URL(apiUrl)

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  use: {
    baseURL: frontendUrl,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: `php artisan serve --env=e2e --host=${api.hostname} --port=${api.port}`,
      cwd: apiRepo,
      url: `${apiUrl}/api/health`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ...process.env,
        APP_URL: apiUrl,
        FRONTEND_URL: frontendUrl,
        FRONTEND_URLS: frontendUrl,
        SANCTUM_STATEFUL_DOMAINS: frontend.host,
      },
    },
    {
      command: `npm run dev -- --host ${frontend.hostname} --port ${frontend.port} --strictPort`,
      url: `${frontendUrl}/admin/login`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { ...process.env, VITE_API_BASE_URL: apiUrl },
    },
  ],
  projects: [
    { name: 'chromium', testIgnore: /mobile\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', testMatch: /mobile\.spec\.ts/, use: { ...devices['Pixel 7'] } },
  ],
})
