# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup

```bash
npm install
npx playwright install
cp env.template .env   # then fill in credentials
```

Required `.env` variables: `URL` (app URL, e.g. `www.saucedemo.com`), `USERS_PASSWORD` (shared password for every SauceDemo test account, e.g. `secret_sauce`).

## Commands

```bash
# Run all tests
npm test

# Open interactive UI mode
npm run test:ui

# Open last HTML report
npm run report

# Run a single test file
npx playwright test tests/checkout.spec.ts

# Run on a specific project (configured: 'Desktop Chrome, standard user', 'Mobile Chrome, standard user')
npx playwright test --project 'Desktop Chrome, standard user'
```

Local retries default to `0`; override with `RETRIES=n npm test` (`playwright.config.ts` reads `process.env.RETRIES`, ignored on CI where it's hardcoded to `2`).

## Architecture

### Page object hierarchy

```
Base (src/pages/base.ts)
  ├── LoginPage
  └── BaseViewPage (src/pages/base-view.page.ts)
       └── InventoryPage / CartPage / CheckoutStepOnePage / CheckoutStepTwoPage / CheckoutCompletePage
            └── Components (header, etc.)
```

`Base` holds `page: Page` and `root: Page | Locator`, and exposes `getByTestId`, `getByRole`, `locator`. Components extend `Base` and override `root` to scope their locators to a container element. `Base` also exposes `waitForResponse()` decorated with `@step` for intercepting API calls. `LoginPage` extends `Base` directly (no header chrome before login); every authenticated page extends `BaseViewPage`, which composes a `Header` component (burger menu, nav links, cart icon/badge).

SauceDemo tags elements with `data-test`, not `data-testid` — `playwright.config.ts` sets `use.testIdAttribute: 'data-test'` so `getByTestId` resolves correctly everywhere.

### Steps

`Steps` (src/steps/index.ts) is assembled via `applyMixins` from separate step classes:
- `LoginSteps` — `checkLoginPage`, `attemptLogin`, `checkLoginError`
- `InventorySteps` — `openInventoryPage`, `addItemToCart`, `removeItemFromCart`, `checkCartBadgeCount`, `sortProductsBy`
- `CartSteps` — `openCartPage`, `checkCartContainsItems`, `removeItemFromCartPage`, `proceedToCheckout`
- `CheckoutSteps` — `fillCheckoutInfo`, `continueToOverview`, `attemptContinueToOverview`, `checkCheckoutInfoError`, `checkOrderTotal`, `finishCheckout`, `checkOrderComplete`

Steps are injected via the `steps` fixture and are the primary API for orchestrating test flows.

All classes extend `BaseSteps` (src/steps/base.steps.ts), which provides shared access to `app` and `testInfo`.

### Fixtures (src/fixtures/)

All test files import from `src/fixtures` (never directly from `@playwright/test`). Custom fixtures:
- `app` — page object container (`App` with `loginPage`, `inventoryPage`, `cartPage`, `checkoutStepOnePage`, `checkoutStepTwoPage`, `checkoutCompletePage`, `notification`)
- `steps` — composed `Steps` instance
- `networkMonitor` (auto) — opt-in request recording; enable via `@NETWORK_MONITOR` tag + `NETWORK_MONITOR=true` env var
- `notificationHandler` (auto) — registers a `page.addLocatorHandler` on `app.notification` (`page.getByRole('alert')`) that waits for it to hide whenever it appears, so tests never have to dismiss alerts manually
- `login` (auto) — navigates to login and authenticates before each test (from `src/fixtures/login`)

`user` is a **test option** (`TestOptions.user`, default `'standardUser'`) consumed by the `login` fixture to pick which SauceDemo account (`src/helpers/users`) to log in as. Projects override it per-run, e.g. `use: { ...devices['Pixel 7'], user: 'standardUser' }` — add a project with a different `user` value to run the suite as another account on a given device.

Types are defined in `src/fixtures/fixtures.types.ts` (`TestOptions`, `TestFixtures`).

### Helper utilities (src/helpers/)

- `users/` — `UserBuilder` and `users` constant, `User` type
- `network-monitor/` — `NetworkMonitor`, backs the `networkMonitor` fixture (`@NETWORK_MONITOR` tag)
- `app.ts` — `App` container (page object wrapper)
- `utils.ts` — `step` decorator, `applyMixins`, `goto`, `getBaseURL`, `getNumber`, and other shared helpers

### User builder

Users are built with the `UserBuilder` pattern — fluent API with `validate()` + `build()`:

```typescript
const user = new UserBuilder('Standard', 'standard_user').validate().build();
```

`validate()` asserts the shared `USERS_PASSWORD` env var exists before the test starts; `build()` returns the plain `User` object. SauceDemo's accounts (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`) all share one password, so every `UserBuilder` call reads the same env var.

### Writing tests

```typescript
import { test, expect } from 'src/fixtures';

test.describe(() => {
  test('Descriptive test name', async ({ app, steps }) => {
    await steps.addItemToCart('Sauce Labs Backpack');
    await steps.checkCartBadgeCount(1);
  });
});
```

- All test files that need auto-login import `test` from `src/fixtures`
- Tests that test the login page itself import `test` from `src/fixtures/base` (no auto-login)
- `login.spec.ts` is the reference example for testing pre-auth flows

### Assertions

```typescript
// Include description for non-obvious assertions
await expect(element, 'Table should have rows').toHaveCount(n);

// Array content
await expect(element).toContainText(['A', 'B'], { ignoreCase: true, useInnerText: true });

// Async retry (for flaky multi-step interactions)
await expect(async () => { /* actions */ }).toPass();

// Polling
await expect.poll(async () => someCondition).toBeTruthy();

// Soft catch fallback
await expect(element).toContainText('msg').catch(async () => {
  await expect(other).toBeHidden();
});

// Custom: floating-point comparison with tolerance
expect(received).toBeWithTolerance(expected, { tolerance: 0.1 });
```

### Timeouts

Write as underscored numeric literals: `5_000`, `20_000`, `60_000`. Default timeouts: test = 90 s, assertion = 20 s. Use `test.slow()` inside the body to triple the timeout for long-running tests. Avoid `page.waitForTimeout()` for UI state — use `element.waitFor({ state })` or `expect.poll()` instead.

### Network Monitor

Tag a test with `@NETWORK_MONITOR` and run with `NETWORK_MONITOR=true` to capture all network requests. Reports are written to `./network-report/{tags}/{project}/{timestamp}/` as JSON + CSV, split into backend (xhr/fetch/ws) and assets.

```bash
NETWORK_MONITOR=true npx playwright test --grep @NETWORK_MONITOR
```

### Adding new page object methods

- Decorate every public **async** method with `@step('Description')` from `src/helpers/utils`
- Prefer `getByTestId` for locators; fall back to `getByRole` then `locator`
- Mark locators `protected readonly` unless they need to be accessed from tests directly
- Place element definitions as `readonly` class properties; place methods below
- Order members: locators → abstract → sync → async
- Exception to the `@step` rule: sync getter methods (e.g. `getItem()`, `getCartItem()`) and type guards stay public and synchronous without `@step`. `@step` is reserved for async action methods (clicks, navigation, waits) — applying it to a sync getter forces `await` at every call site for no benefit.

### Path aliases

`src/*` is configured in `tsconfig.json`. Always use this alias — never use relative paths that traverse more than one directory level up (e.g., `../../helpers/utils`).

## What to avoid

- **Hardcoded waits** — never use `page.waitForTimeout()`. Use `element.waitFor({ state })`, `expect(element).toBeVisible()`, or `expect.poll()` instead.
- **Importing from `@playwright/test` directly** — always import `test`, `expect`, and Playwright types from `src/fixtures`, which re-exports everything with custom fixtures and matchers layered on top. (Exception: files under `src/steps/` import `expect` straight from `@playwright/test` to avoid a circular import with `src/fixtures`, which itself imports `Steps`.)
- **Locating elements by CSS class** — classes are unstable. Use `getByTestId`, then `getByRole`, then `locator` with a semantic selector as a last resort.
- **Duplicating step logic in tests** — if an action is used more than once, it belongs in the appropriate step class, decorated with `@step()`.
- **`test.only`** — forbidden on CI (`forbidOnly: true` in config). Never commit it.
- **Relative imports crossing multiple directories** — use the `src/*` path alias instead of `../../helpers/utils`.
- **Defining locators in test files** — locators belong in page object classes, not in tests. Expose them via page object methods or properties; tests should only call those.
- **Asserting without waiting** — synchronous `expect(value).toBe(x)` on values retrieved from the DOM can race. Prefer `await expect(locator).toHaveText(x)` so Playwright retries automatically.
