import { test, expect } from '../src/base-test';
import { steps } from '../src/steps';
import { users } from '../src/users';
import { API } from '../src/helpers/api';
import { goto } from '../src/navigation';

test('Login test user', async ({ loginPage, sidebar }) => {
  await steps['Login test user'](loginPage);
  await steps['company name is shown in the sidebar'](sidebar);
});

test('Login page is shown after opening base url', async ({ page, loginPage }) => {
  await test.step('Open base url', async () => {
    await page.goto('/');

    expect(page).toHaveURL(loginPage.url());
  });
  
  await steps['Verify login page elements'](loginPage);
});

test('Try to log in with invalid password', async ({ page, loginPage }) => {
  await test.step('Enter invalid data', async () => {
    await goto(loginPage);
    await loginPage.emailField.fill(users.testUser.email);
    await loginPage.passwordField.fill('0000');
  });

  await test.step('Try to log in and check error message', async () => {
    const [res] = await Promise.all([
      page.waitForResponse(API.regex.signIn),
      loginPage.loginButton.click()
    ]);

    expect(res.ok()).toBeFalsy();
    await expect(loginPage.wrongCredentialsMessage).toBeVisible();
  });
});
