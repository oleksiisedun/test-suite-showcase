import { Page } from '@playwright/test';

export type GotoOptions = Parameters<Page['goto']>[1];

export interface Navigatable {
  page: Page;
  url(urlParams?: Record<string, any>): string;
  waitForLoadState(): Promise<void>;
}
