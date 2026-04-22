import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from 'src/fixtures';

import 'dotenv/config';

export default defineConfig<TestOptions>({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 90_000,
  expect: { timeout: 20_000 },
  reporter: 'html',
  use: {
    baseURL: 'https://dev.omni-dispatch.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome, test user',
      use: { ...devices['Desktop Chrome'], user: 'testUser' },
    },
  ],
});
