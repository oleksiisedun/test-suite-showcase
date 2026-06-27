import { Page } from '@playwright/test';

export interface Navigatable {
  page: Page;
  url(urlParams?: Record<string, any>): string;
  waitForLoadState(): Promise<void>;
}
