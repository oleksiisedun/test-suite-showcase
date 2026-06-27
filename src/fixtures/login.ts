export * from '@playwright/test';

import { test as base } from 'src/fixtures/base';
import { users } from 'src/helpers/users';
import { goto } from 'src/helpers/utils';
import { TestOptions } from './fixtures.types';

type LoginFixture = {
  login: void;
}

export const test = base.extend<LoginFixture & TestOptions>({
  user: ['testUser', { option: true }],
  login: [async ({ app, user }, use) => {
    await goto(app.loginPage);
    await app.loginPage.login(users[user]);
    await use();
  }, { auto: true }]
});
