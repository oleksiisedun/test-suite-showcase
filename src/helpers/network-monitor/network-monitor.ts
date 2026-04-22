import { Page, Request, TestInfo } from '@playwright/test';
import { RequestData } from './network-monitor.types';
import { json2csv } from 'json-2-csv';
import * as fs from 'node:fs';

const isBackendRequestType = (type: string) => ['xhr', 'fetch', 'eventsource', 'websocket'].includes(type);
const tagRegExp = /network.*monitor/i;

export class NetworkMonitor {
  private readonly requests: RequestData[] = [];
  private readonly timestamp: number;

  constructor(readonly page: Page, readonly testInfo: TestInfo) {
    this.timestamp = Date.now();
  }

  static isEnabled(testInfo: TestInfo) {
    return process.env.NETWORK_MONITOR && testInfo.tags.some(tag => tagRegExp.test(tag));
  }

  private async getSizes(request: Request) {
    try {
      return await request.sizes();
    } catch {
      return null;
    }
  }

  private async getStatus(request: Request) {
    try {
      return (await request.response()).status();
    } catch {
      return null;
    }
  }

  async start(url: string | RegExp = '**/*') {
    await this.page.route(url, async (route, request) => {
      await route.continue();

      const url = new URL(request.url());
      this.requests.push({
        env: url.hostname,
        pathname: url.pathname,
        href: url.href,
        type: request.resourceType(),
        status: await this.getStatus(request),
        time: request.timing(),
        ...(request.failure() ? { errorMessage: request.failure().errorText } : { size: await this.getSizes(request) }),
      });
    });
  }

  async stop() {
    await this.page.unrouteAll({ behavior: 'ignoreErrors' });
  }

  processRequests() {
    this.requests.forEach(item => {
      item.pathname = item.pathname.slice(1);
      item.time.startTime = new Date(item.time.startTime);
    });
    this.requests.sort((a, b) => a.pathname.localeCompare(b.pathname));
  }

  exportReport() {
    const tags = this.testInfo.tags.filter(tag => !tagRegExp.test(tag)).join('-').replace(/@/g, '');
    const project = this.testInfo.project.name.replace(/[\s,]+/g, '-').toLowerCase();
    const path = `./network-report/${tags}/${project}/${this.timestamp}`;
    const backendRequests = this.requests.filter(({ type }) => isBackendRequestType(type));
    const assetsRequests = this.requests.filter(({ type }) => !isBackendRequestType(type));

    fs.mkdirSync(path, { recursive: true });

    fs.writeFileSync(`${path}/backend.json`, JSON.stringify(backendRequests));
    fs.writeFileSync(`${path}/assets.json`, JSON.stringify(assetsRequests));

    fs.writeFileSync(`${path}/backend.csv`, json2csv(backendRequests));
    fs.writeFileSync(`${path}/assets.csv`, json2csv(assetsRequests));
  }
}
