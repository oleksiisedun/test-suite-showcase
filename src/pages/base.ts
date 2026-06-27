import { Locator, Page } from '@playwright/test';
import { step } from 'src/helpers/utils';

/**
 * Root class for all page objects and components.
 *
 * `root` defaults to the full `page` but component subclasses override it with a scoped
 * locator so that `getByTestId`, `getByRole`, and `locator` all resolve within that
 * container instead of the whole page.
 */
export abstract class Base {
  protected readonly root: Page | Locator;

  constructor(readonly page: Page) {
    this.root = page;
  }

  protected locator(...args: Parameters<Page['locator']>) {
    return this.root.locator(...args);
  }

  protected getByRole(...args: Parameters<Page['getByRole']>) {
    return this.root.getByRole(...args);
  }

  protected getByTestId(...args: Parameters<Page['getByTestId']>) {
    return this.root.getByTestId(...args);
  }

  protected getByText(...args: Parameters<Page['getByText']>) {
    return this.page.getByText(...args);
  }

  protected getByType(type: string) {
    return this.locator(`[type="${type}"]`);
  }

  @step('Wait for response')
  async waitForResponse(...args: Parameters<Page['waitForResponse']>) {
    // Always scoped to the full page — response events are not scoped to a locator.
    return this.page.waitForResponse(...args);
  }
}
