import { Page } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { DriversPage } from "../pages/drivers.page";

export class App {
  constructor(readonly page: Page) {}

  readonly loginPage = new LoginPage(this.page);
  readonly driversPage = new DriversPage(this.page);
}
