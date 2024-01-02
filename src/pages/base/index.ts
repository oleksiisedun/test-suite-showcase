import { BaseLocators } from './locators';
import { Sidebar } from './sidebar';

export abstract class BasePage extends BaseLocators {
  readonly sidebar = new Sidebar(this.page);
}
