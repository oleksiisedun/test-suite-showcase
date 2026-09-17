import { Page } from '@playwright/test';

export interface Navigatable {
  page: Page;
  url(urlParams?: Record<string, unknown>): string;
  waitForLoadState(): Promise<void>;
}
