import { test } from '@playwright/test';

export function step(title?: string) {
  return function(target: Function, context: ClassMethodDecoratorContext) {
    return function(...args: any) {
      return test.step(title ?? context.name as string, async () => target.call(this, ...args));
    }
  };
}
