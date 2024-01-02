export * from '@playwright/test';

import { test as base } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { DriversPage } from './pages/drivers.page';
import { Sidebar } from './pages/base/sidebar';

type TestFixtures = {
  loginPage: LoginPage;
  driversPage: DriversPage;
  sidebar: Sidebar;
}

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => await use(new LoginPage(page)),
  driversPage: async ({ page }, use) => await use(new DriversPage(page)),
  sidebar: async ({ page }, use) => await use(new Sidebar(page)),
});
