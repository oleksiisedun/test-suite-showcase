import { expect } from '@playwright/test';
import { Base } from './base';
import { Header } from './components/header';
import { Navigatable } from './pages.types';

export abstract class BaseViewPage extends Base implements Navigatable {
  abstract readonly pageURL: string;

  readonly header = new Header(this.page);

  url() {
    return this.pageURL;
  }

  async waitForLoadState(): Promise<void> {
    await expect(this.header.cartLink).toBeVisible();
  }
}
