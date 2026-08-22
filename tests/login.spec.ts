import { test } from 'src/fixtures/base';
import { goto } from 'src/helpers/utils';
import { users } from 'src/helpers/users';

test.describe(() => {
  test('Login page is shown after opening base url', async ({ app, steps }) => {
    await goto(app.loginPage);
    await steps.checkLoginPage();
  });

  test('Locked out user sees an error message', async ({ app, steps }) => {
    await goto(app.loginPage);
    await steps.attemptLogin(users.lockedOutUser);
    await steps.checkLoginError('Epic sadface: Sorry, this user has been locked out.');
  });

  test('Invalid credentials show an error message', async ({ app, steps }) => {
    await goto(app.loginPage);
    await steps.attemptLogin({ name: 'Invalid', username: 'invalid_user', password: 'wrong_password' });
    await steps.checkLoginError('Epic sadface: Username and password do not match any user in this service');
  });
});
