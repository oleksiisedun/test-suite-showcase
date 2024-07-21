import { APIRequestContext, expect } from "@playwright/test";

export const endpoints = {
  me: '/api/v1/dispatchers/me?'
} as const;

export const regexes = {
  signIn: /v1\/sign-in/,
  drivers: /v1\/drivers\?page/  
} as const;

export class API {
  constructor(readonly request: APIRequestContext) {}

  async get(name: keyof typeof endpoints, options?: Parameters<APIRequestContext['get']>[1]) {    
    const res = await this.request.get(endpoints[name], options);
    
    await expect(res).toBeOK();

    return res.json();
  }
}
