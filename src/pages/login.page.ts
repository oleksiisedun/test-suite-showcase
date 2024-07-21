import { expect } from '@playwright/test';
import { User } from "../helpers/users";
import { regexes } from '../helpers/api';
import { Base } from './base';
import { Navigatable } from './navigatable';

export class LoginPage extends Base implements Navigatable {
  readonly emailField = this.getByType('email');
  readonly passwordField = this.getByType('password');
  readonly loginButton = this.locator('button').getByText('Log in');
  readonly wrongCredentialsMessage = this.getByText('Wrong Email or password');

  url() {
    return 'login';
  }

  async waitForLoadState() {}

  async login(user: User) {
    await this.emailField.fill(user.email);
    await this.passwordField.fill(user.password);
    const [res] = await Promise.all([
      this.page.waitForResponse(regexes.signIn),
      this.loginButton.click()
    ]);

    expect(res.ok()).toBeTruthy();
  }
}
