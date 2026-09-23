import { expect, Locator } from '@playwright/test';
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

  /** Filters an `inventory-item` locator down to the one matching `name`, by its
   * `inventory-item-name` child text — shared by inventory and cart item lists. */
  protected getItemByName(items: Locator, name: string) {
    return items.filter({ has: this.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
  }

  protected getRemoveButtonFor(items: Locator, name: string) {
    return this.getItemByName(items, name).getByRole('button', { name: 'Remove' });
  }
}
