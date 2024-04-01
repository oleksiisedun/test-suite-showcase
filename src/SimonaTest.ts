//this is made just for a fork test case - it is not a relevant file
export * from '@playwright/test';

import { test as base } from '@playwright/test';
import { LoginPageSimonasTest } from './pages/login.page';
import { DriversPageSimonasTest } from './pages/drivers.page';
import { Sidebar } from './pages/base/sidebar';

type TestFixtures = {
  loginPageSimonasTest: LoginPageSimonasTest;
  driversPageSimonasTest: DriversPageSimonasTest;
  sidebar: Sidebar;
}

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => await use(new LoginPageSimonasTest(page)),
  driversPage: async ({ page }, use) => await use(new DriversPageSimonasTest(page)),
  sidebar: async ({ page }, use) => await use(new Sidebar(page)),
});