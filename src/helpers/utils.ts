import { test, expect, Locator, Page } from '@playwright/test';
import { randomInt } from 'crypto';
import { Navigatable } from 'src/pages';

/** Navigates to the URL produced by `pageObject.url(urlParams)` rather than a
 * raw string, so URL params stay typed to the target page object. */
export async function goto<T extends Navigatable>(
  pageObject: T,
  urlParams?: Parameters<T['url']>[0],
  options?: Parameters<Page['goto']>[1]
) {
  return pageObject.page.goto(pageObject.url(urlParams), options);
}

/** Generates a numeric string of the given length where the first digit is
 * always 1–9 (no leading zero). */
export const generateRandomNumericString = (length = 16) =>
  Array.from({ length }, (_, i) => (i ? randomInt(10) : randomInt(1, 10))).join('');

/** Copies all prototype methods from each base constructor onto the derived
 * constructor — the standard TS mixin recipe. Used to assemble `Steps` from
 * its constituent classes in `src/steps/index.ts`. */
export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}

/** Decorator that wraps the method body in `test.step()` so it appears as its
 * own named entry in the Playwright trace and report. `title` defaults to the
 * method name when omitted. */
export function step<This, Args extends unknown[], Return>(title?: string) {
  return function(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ) {
    return function replacementMethod(this: This, ...args: Args): Promise<Awaited<Return>> {
      return test.step(title ?? context.name as string, () => target.call(this, ...args)) as Promise<Awaited<Return>>;
    };
  };
}

/** Resolves the app base URL from env, falling back to `URL` when `API`
 * is unset, and auto-prefixes `https://` if the value has no scheme. */
export function getBaseURL(options = { api: false }) {
  const url = options.api ? (process.env.API ?? process.env.URL) : process.env.URL;

  expect(url).toBeTruthy();

  return url!.includes('://') ? url! : `https://${url}`;
}

/** Extracts the first numeric token from a UI text string, stripping
 * thousands-separator commas (e.g. `"1,234.56 pts"` → `1234.56`). */
export const getNumber = (str: string) => parseFloat(str.replace(/,/g, '').match(/[\d.]+/)![0]);

/** Non-throwing boolean wrapper around `expect(locator).toBeInViewport()`,
 * suited for branching on element position without asserting it. The short
 * default timeout avoids long waits in polling-style checks. */
export const isInViewport = async (
  locator: Locator,
  options: { ratio?: number; timeout?: number } = { timeout: 1_000 }
) => expect(locator).toBeInViewport(options).then(() => true).catch(() => false);

/** Non-throwing boolean wrapper around `expect(locator).toBeVisible()`,
 * for branching on element state instead of asserting it. */
export const isVisible = async (
  locator: Locator,
  options = { timeout: 1_000 }
) => expect(locator).toBeVisible(options).then(() => true).catch(() => false);

/** Asserts (via `expect`) that `arrLength >= amount` — call sites must guarantee there are
 * enough elements; this is not a no-op when the condition fails. */
export function getRandomIndexes(arrLength: number, amount: number) {
  const indexes: number[] = [];

  expect(arrLength).toBeGreaterThanOrEqual(amount);

  while (indexes.length < amount) {
    const index = randomInt(arrLength);

    if (indexes.includes(index)) continue;
    indexes.push(index);
  }

  return indexes;
}

/** Picks `amount` random elements from a multi-match locator, useful for
 * varying which page elements a test interacts with without hardcoding indexes. */
export async function getRandomLocators(locators: Locator, amount: number) {
  return getRandomIndexes(await locators.count(), amount).map(i => locators.nth(i));
}

export async function getRandomLocator(locators: Locator): Promise<Locator> {
  return (await getRandomLocators(locators, 1))[0]!;
}

/** Fisher-Yates shuffle. Returns a new array — does not mutate the input. */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i >= 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j]!, shuffledArray[i]!];
  }

  return shuffledArray;
}

/** Returns a random subset of `amount` items, preserving their original
 * relative order (unlike `shuffleArray`). */
export function getRandomItems<T>(array: T[], amount = 1) {
  const indexes = getRandomIndexes(array.length, amount);

  return array.filter((_, i) => indexes.includes(i));
}

/** Counter-as-closure retry guard. Returns a function that decrements and
 * returns truthy on each call, then `0` (falsy) once `amount` calls have been
 * made. Designed to be passed as a default parameter and called inline as a
 * `while`/`do-while` loop condition to cap manual retries without recursion. */
export function retryer(amount: number) {
  let count = amount;

  return () => count > 0 ? count-- : 0;
}
