import { APIRequestContext, expect } from '@playwright/test';
import { APIEndpoints, type APIEndpoint } from '.';

/** Thin wrapper around Playwright's `APIRequestContext` for calling app backend
 * endpoints directly (bypassing the UI) — e.g. seeding or cleaning up test data.
 * Not currently wired into any fixture: SauceDemo has no real backend API, so this
 * exists as scaffolding for a project that does. Add entries to `APIEndpoints` and
 * call `api.get('name')` once there's a real endpoint to hit. */
export class API {
  constructor(readonly request: APIRequestContext) {}

  /** Resolves `name` to a URL via `APIEndpoints` and asserts the response is 2xx. */
  async get(name: APIEndpoint, options?: Parameters<APIRequestContext['get']>[1]) {
    const res = await this.request.get(APIEndpoints[name], options);

    await expect(res).toBeOK();

    return res.json();
  }
}
