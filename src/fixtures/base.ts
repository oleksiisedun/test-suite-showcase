export * from '@playwright/test';

import { test as base } from '@playwright/test';
import { App } from 'src/helpers/app';
import { API } from 'src/helpers/api';
import { Steps } from 'src/steps';
import { NetworkMonitor } from 'src/helpers/network-monitor';

type TestFixtures = {
  app: App;
  api: API;
  steps: Steps;
  networkMonitor: void;
  notificationHandler: void;
}

export const test = base.extend<TestFixtures>({
  app: async ({ page }, use) => await use(new App(page)),
  api: async ({ page }, use) => await use(new API(page.request)),
  steps: async ({ app, api }, use) => await use(new Steps(app, api)),

  networkMonitor: [async ({ page }, use, testInfo) => {
    if (NetworkMonitor.isEnabled(testInfo)) {
      const monitor = new NetworkMonitor(page, testInfo);
      await monitor.start();
      await use();
      await monitor.stop();
      monitor.processRequests();
      monitor.exportReport();
    } else await use();
  }, { auto: true }],

  notificationHandler: [async ({ app, page }, use) => {
    await page.addLocatorHandler(app.notification, async () => {
      await app.notification.waitFor({ state: 'hidden' });
    });
    await use();
  }, { auto: true }],
});
