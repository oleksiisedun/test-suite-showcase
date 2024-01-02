import { Page } from '@playwright/test';

export abstract class BaseLocators {
  constructor(readonly page: Page) {}

  protected locator(...args: Parameters<Page['locator']>) {
    return this.page.locator(...args);
  }

  protected getByText(...args: Parameters<Page['getByText']>) {
    return this.page.getByText(...args);
  }

  protected getByType(type: string) {
    return this.locator(`[type="${type}"]`);
  }
}
