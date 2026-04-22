import { test } from 'src/fixtures/base';
import { goto } from 'src/helpers/utils';

test('Login page is shown after opening base url', async ({ app, steps }) => {
  await goto(app.loginPage);
  await steps.checkLoginPage();
});
