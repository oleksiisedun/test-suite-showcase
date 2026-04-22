import { Page } from '@playwright/test';
import { LoginPage } from 'src/pages/login.page';
import { DriversPage } from 'src/pages/drivers.page';

export class App {
  constructor(readonly page: Page) {}

  readonly loginPage = new LoginPage(this.page);
  readonly driversPage = new DriversPage(this.page);

  readonly notification = this.page.getByRole('alert');
}
