import { expect } from '@playwright/test';
import { BaseSteps } from './base.steps';
import { step } from 'src/helpers/utils';
import { User } from 'src/helpers/users';

export class LoginSteps extends BaseSteps {
  @step('Check login page')
  async checkLoginPage() {
    await expect(this.app.loginPage.usernameField).toBeVisible();
    await expect(this.app.loginPage.passwordField).toBeVisible();
    await expect(this.app.loginPage.loginButton).toBeVisible();
  }

  @step('Attempt login')
  async attemptLogin(user: User) {
    await this.app.loginPage.usernameField.fill(user.username);
    await this.app.loginPage.passwordField.fill(user.password);
    await this.app.loginPage.loginButton.click();
  }

  @step('Check login error message')
  async checkLoginError(message: string) {
    await expect(this.app.loginPage.errorMessage).toContainText(message);
  }
}
