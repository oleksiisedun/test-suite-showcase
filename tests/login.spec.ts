import { test } from "../src/fixtures/base";
import { goto } from "../src/pages/navigatable";

test('Login page is shown after opening base url', async ({ app, steps }) => {
  await goto(app.loginPage);
  await steps.checkLoginPage();
});
