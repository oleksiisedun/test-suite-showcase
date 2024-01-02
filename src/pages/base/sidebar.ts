import { BaseLocators } from "./locators";

export class Sidebar extends BaseLocators {
  readonly sidebar = this.locator('#main-sidebar');
  readonly companyName = this.sidebar.locator('.company-name');
}
