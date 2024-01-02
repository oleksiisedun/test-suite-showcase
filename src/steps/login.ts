import { expect } from "@playwright/test";
import { goto } from "../navigation";
import { LoginPage } from "../pages/login.page";
import { users } from "../users";

export const loginSteps = {
  'Login test user': async (loginPage: LoginPage) => {
    await goto(loginPage);
    await loginPage.login(users.testUser);
  },
  'Verify login page elements': async (loginPage: LoginPage) => {
    await expect(loginPage.emailField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  }
}