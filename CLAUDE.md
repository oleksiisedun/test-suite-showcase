# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup

```bash
npm install
npx playwright install
cp .env.template .env   # then fill in credentials
```

Required `.env` variable: `USER_TEST_PASS` (password for the test user account).

## Commands

```bash
# Run all tests
npm test

# Open interactive UI mode
npm run test:ui

# Open last HTML report
npm run report

# Run a single test file
npx playwright test tests/drivers.spec.ts

# Run on a specific project
npx playwright test --project 'Desktop Chrome, test user'
```

## Architecture

### Page object hierarchy

```
Base (src/pages/base.ts)
  └── BaseViewPage (src/pages/base-view.page.ts)
       └── LoginPage / DriversPage
            └── Components (sidebar, etc.)
```

`Base` holds `page: Page` and `root: Page | Locator`, and exposes `getByTestId`, `getByText`, `locator`. Components extend `Base` and override `root` to scope their locators to a container element.

### Steps

`Steps` (src/steps/index.ts) is assembled via `applyMixins` from separate step classes:
- `LoginSteps` — `checkLoginPage`
- `DriversSteps` — `openDriversPage`, `checkTableIsFilledWithData`

Steps are injected via the `steps` fixture and are the primary API for orchestrating test flows.

### Fixtures (src/fixtures/)

All test files import from `src/fixtures` (never directly from `@playwright/test`). Custom fixtures:
- `app` — page object container (`App` with `loginPage`, `driversPage`, `notification`)
- `steps` — composed `Steps` instance
- `api` — raw `API` instance for direct HTTP calls
- `networkMonitor` (auto) — opt-in request recording; enable via `@NETWORK_MONITOR` tag + `NETWORK_MONITOR=true` env var
- `notificationHandler` (auto) — auto-dismisses `[role="alert"]` notifications
- `login` (auto) — navigates to login and authenticates before each test (from `src/fixtures/login`)

### User builder

Users are built with the `UserBuilder` pattern — fluent API with `validate()` + `build()`:

```typescript
const user = new UserBuilder('Test', 'test@gmail.com').validate().build();
```

`validate()` asserts the password env var exists before the test starts; `build()` returns the plain `User` object.

### Writing tests

```typescript
import { test, expect } from 'src/fixtures';

test.describe(() => {
  test('Descriptive test name', async ({ app, steps }) => {
    await steps.openDriversPage();
    await steps.checkTableIsFilledWithData();
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

// Async retry (for flaky multi-step interactions)
await expect(async () => { /* actions */ }).toPass();

// Polling
await expect.poll(async () => someCondition).toBeTruthy();

// Custom: floating-point comparison with tolerance
expect(received).toBeWithTolerance(expected, { tolerance: 0.1 });
```

### Timeouts

Write as underscored numeric literals: `5_000`, `20_000`, `60_000`. Default timeouts: test = 90 s, assertion = 20 s. Avoid `page.waitForTimeout()` for UI state — use `element.waitFor({ state })` or `expect.poll()` instead.

### Network Monitor

Tag a test with `@NETWORK_MONITOR` and run with `NETWORK_MONITOR=true` to capture all network requests. Reports are written to `./network-report/{tags}/{project}/{timestamp}/` as JSON + CSV, split into backend (xhr/fetch/ws) and assets.

```bash
NETWORK_MONITOR=true npx playwright test --grep @NETWORK_MONITOR
```

### Route interception

```typescript
// Mutate request body
await app.page.route('**/api/v1/example', async route => {
  const postData = route.request().postDataJSON();
  postData.field = 'mutated';
  await route.continue({ postData: JSON.stringify(postData) });
});

// Mutate response body
await app.page.route('**/api/v1/example', async route => {
  const response = await route.fetch();
  const body = await response.json();
  body.field = 'mutated';
  await route.fulfill({ response, body: JSON.stringify(body) });
});
```

### Path aliases

`src/*` is configured in `tsconfig.json`. Always use this alias — never use relative paths that traverse more than one directory level up (e.g., `../../helpers/utils`).

## What to avoid

- **Hardcoded waits** — never use `page.waitForTimeout()`. Use `element.waitFor({ state })`, `expect(element).toBeVisible()`, or `expect.poll()` instead.
- **Importing from `@playwright/test` directly** — always import `test` and `expect` from `src/fixtures`, which re-exports everything with custom fixtures and matchers layered on top.
- **Locating elements by CSS class** — classes are unstable. Use `getByTestId`, then `getByRole`, then `locator` with a semantic selector as a last resort.
- **Duplicating step logic in tests** — if an action is used more than once, it belongs in the appropriate step class, decorated with `@step()`.
- **`test.only`** — forbidden on CI (`forbidOnly: true` in config). Never commit it.
- **Relative imports crossing multiple directories** — use the `src/*` path alias instead of `../../helpers/utils`.
