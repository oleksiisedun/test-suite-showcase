import { expect as baseExpect } from '@playwright/test';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Playwright's own documented pattern for declaring a custom matcher's type
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Matchers<R, T> requires both type params even though this matcher only extends R
    interface Matchers<R, T> {
      toBeWithTolerance(expected: number, options?: { tolerance: number }): R;
    }
  }
}

export const expect = baseExpect.extend({
  toBeWithTolerance(received: number, expected: number, options?: { tolerance: number }) {
    const assertionName = 'toBeWithTolerance';
    const tolerance = options?.tolerance ?? 0.1;
    let pass: boolean;

    try {
      baseExpect(+Math.abs(received - expected).toFixed(2)).toBeLessThanOrEqual(tolerance);
      pass = true;
    } catch {
      pass = false;
    }

    const message = () =>
      this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
      '\n\n' +
      `Expected: ${this.isNot ? 'not ' : ''}${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(received)}\n` +
      `Tolerance: ${tolerance}`;

    return {
      message,
      pass,
      name: assertionName,
      expected,
    };
  },
});
