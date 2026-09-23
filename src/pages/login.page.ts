import { User } from 'src/helpers/users';
import { clickAndWaitForURL } from 'src/helpers/utils';
import { Base } from './base';
import { Navigatable } from './pages.types';

export class LoginPage extends Base implements Navigatable {
  readonly usernameField = this.getByTestId('username');
  readonly passwordField = this.getByTestId('password');
  readonly loginButton = this.getByTestId('login-button');
  readonly errorMessage = this.getByTestId('error');

  url() {
    return '';
  }

  async waitForLoadState() {}

  async login(user: User) {
    await this.usernameField.fill(user.username);
    await this.passwordField.fill(user.password);
    await clickAndWaitForURL(this.loginButton, '**/inventory.html');
  }
}
