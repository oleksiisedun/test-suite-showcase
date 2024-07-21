import { Page } from '@playwright/test';

export type GotoOptions = Parameters<Page['goto']>[1];

export interface Navigatable {
  page: Page;
  url(urlParams?: Record<string, any>): string;
  waitForLoadState(): Promise<void>;
}

export async function goto<T extends Navigatable>(
  pageObject: T,
  urlParams?: Parameters<T['url']>[0],
  options?: GotoOptions
) {
  return pageObject.page.goto(pageObject.url(urlParams), options);
}
