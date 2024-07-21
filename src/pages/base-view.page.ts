import { expect } from '@playwright/test';
import { Base } from './base';
import { Sidebar } from './components/sidebar';
import { Navigatable } from './navigatable';

export abstract class BaseViewPage extends Base implements Navigatable {
  abstract readonly pageURL: string;

  readonly sidebar = new Sidebar(this.page);

  url() {
    return this.pageURL;
  }

  async waitForLoadState(): Promise<void> {
    await expect(this.sidebar.companyName).toBeVisible();
  }
}
