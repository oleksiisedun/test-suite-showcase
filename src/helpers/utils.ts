import { test } from '@playwright/test';

export const getTestsStepsProxy = <T extends Record<string, (...params: any[]) => Promise<any>>>(steps: T): T =>
  new Proxy(steps, {
    get: (target, prop: string) => {
      if (prop in target) {
        return async (...params: unknown[]) => test.step(prop, async () => target[prop](...params));
      }
      throw new Error(`Step "${prop}" is not defined`);
    },
  });
