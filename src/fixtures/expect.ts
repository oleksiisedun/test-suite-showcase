import { expect as baseExpect } from '@playwright/test';

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
