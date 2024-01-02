import { expect } from '@playwright/test';
import { BaseLocators } from "./base/locators";
import { Navigation } from "../navigation";
import { User } from "../users";
import { API } from '../helpers/api';

export class LoginPage extends BaseLocators implements Navigation {
  readonly emailField = this.getByType('email');
  readonly passwordField = this.getByType('password');
  readonly loginButton = this.locator('button').getByText('Log in');
  readonly wrongCredentialsMessage = this.getByText('Wrong Email or password');

  url() {
    return 'login';
  }

  async waitForLoadState() {
    await this.page.waitForLoadState('networkidle');
  }

  async login(user: User) {
    await this.emailField.fill(user.email);
    await this.passwordField.fill(user.password);
    const [res] = await Promise.all([
      this.page.waitForResponse(API.regex.signIn),
      this.loginButton.click()
    ]);

    expect(res.ok()).toBeTruthy();
  }
}
