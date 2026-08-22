import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from 'src/fixtures';
import { getBaseURL } from 'src/helpers/utils';

import 'dotenv/config';

export default defineConfig<TestOptions>({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : +process.env.RETRIES! || 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 90_000,
  expect: { timeout: 20_000 },
  reporter: 'html',
  globalSetup: './src/helpers/global-setup',
  globalTeardown: './src/helpers/global-teardown',
  use: {
    baseURL: getBaseURL(),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'Desktop Chrome, standard user',
      use: { ...devices['Desktop Chrome'], user: 'standardUser' },
    },
    {
      name: 'Mobile Chrome, standard user',
      use: { ...devices['Pixel 7'], user: 'standardUser' },
    },
  ],
});
