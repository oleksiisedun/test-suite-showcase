import { expect, Locator } from '@playwright/test';
import { randomInt } from 'crypto';

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

export const generateRandomNumericString = (length = 16) =>
  Array.from({ length }, (_, i) => (i ? randomInt(10) : randomInt(1, 10))).join('');

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

export async function getRandomLocators(locators: Locator, amount: number) {
  return getRandomIndexes(await locators.count(), amount).map(i => locators.nth(i));
}

export async function getRandomLocator(locators: Locator): Promise<Locator> {
  return (await getRandomLocators(locators, 1))[0];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i >= 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

export function getRandomItems<T>(array: T[], amount = 1) {
  const indexes = getRandomIndexes(array.length, amount);
  return array.filter((_, i) => indexes.includes(i));
}

export function retryer(amount: number) {
  let count = amount;
  return () => (count > 0 ? count-- : 0);
}

export const isInViewport = async (
  locator: Locator,
  options: { ratio?: number; timeout?: number } = { timeout: 1_000 }
) => expect(locator).toBeInViewport(options).then(() => true).catch(() => false);

export const isVisible = async (
  locator: Locator,
  options = { timeout: 1_000 }
) => expect(locator).toBeVisible(options).then(() => true).catch(() => false);
