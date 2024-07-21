export * from '@playwright/test';

import { test as base } from './base';
import { users } from '../helpers/users';
import { goto } from '../pages/navigatable';

export type TestOptions = {
  user: keyof typeof users;
}

type TestFixtures = {
  login: void;
}

export const test = base.extend<TestFixtures & TestOptions>({
  user: ['testUser', { option: true }],
  login: [async ({ app, user }, use) => {
    await goto(app.loginPage);
    await app.loginPage.login(users[user]);
    await use();
  }, { auto: true }]
});
