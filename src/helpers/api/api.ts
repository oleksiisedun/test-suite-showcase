import { APIRequestContext, expect } from '@playwright/test';
import { APIEndpoints, APIEndpoint } from '.';

export class API {
  constructor(readonly request: APIRequestContext) {}

  /** Resolves `name` to a URL via `APIEndpoints` and asserts the response is 2xx. */
  async get(name: APIEndpoint, options?: Parameters<APIRequestContext['get']>[1]) {
    const res = await this.request.get(APIEndpoints[name], options);

    await expect(res).toBeOK();

    return res.json();
  }
}
