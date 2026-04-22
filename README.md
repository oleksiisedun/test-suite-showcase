# Playwright Test Suite Showcase

> [!WARNING]
> **Temporary limitations:** This showcase relies on a third-party web service that is currently not functioning as expected. As a result, some tests are skipped. A dedicated sample web page is being built specifically for demonstration purposes and will replace the dependency soon.

A production-grade Playwright test suite demonstrating best practices for end-to-end testing: page object model, composable fixtures, typed step abstractions, network monitoring, and route interception.

---

## Features

- **Page Object Model** — scoped locators, component hierarchy, clean separation of concerns
- **Composable Steps** — mixin-assembled `Steps` class as the primary test API
- **Custom Fixtures** — auto-login, notification handler, network monitor, API client
- **Route Interception** — mutate request/response bodies for isolated test scenarios
- **Network Monitor** — opt-in request capture with JSON + CSV reports
- **Custom Matchers** — e.g. `toBeWithTolerance` for floating-point assertions
- **User Builder** — fluent builder pattern with pre-flight env validation

---

## Setup

```bash
npm install
npx playwright install
cp .env.template .env   # fill in credentials
```

Required environment variable: `USER_TEST_PASS` — password for the test user account.

---

## Commands

```bash
# Run all tests
npm test

# Interactive UI mode (time-travel debugging, watch mode)
npm run test:ui

# Open last HTML report
npm run report

# Run a single spec file
npx playwright test tests/drivers.spec.ts

# Target a specific browser project
npx playwright test --project 'Desktop Chrome, test user'

# Capture network traffic for tagged tests
NETWORK_MONITOR=true npx playwright test --grep @NETWORK_MONITOR
```

---

## Architecture

### Page Object Hierarchy

```
Base (src/pages/base.ts)
  └── BaseViewPage (src/pages/base-view.page.ts)
       └── LoginPage / DriversPage
            └── Components (sidebar, etc.)
```

`Base` holds `page` and `root` (a `Page` or `Locator`), and exposes `getByTestId`, `getByText`, and `locator`. Components extend `Base` and override `root` to scope all their locators to a container element — no leaking selectors.

### Steps

`Steps` (`src/steps/index.ts`) is assembled via `applyMixins` from focused step classes:

| Class | Methods |
|---|---|
| `LoginSteps` | `checkLoginPage` |
| `DriversSteps` | `openDriversPage`, `checkTableIsFilledWithData` |

Steps are injected via the `steps` fixture and are the primary orchestration API in tests.

### Fixtures

All test files import from `src/fixtures` — never directly from `@playwright/test`.

| Fixture | Type | Description |
|---|---|---|
| `app` | manual | Page object container (`loginPage`, `driversPage`, `notification`) |
| `steps` | manual | Composed `Steps` instance |
| `api` | manual | Raw `API` instance for direct HTTP calls |
| `login` | auto | Navigates to login and authenticates before each test |
| `notificationHandler` | auto | Auto-dismisses `[role="alert"]` notifications |
| `networkMonitor` | auto | Opt-in request recorder (requires `@NETWORK_MONITOR` tag) |

### Writing Tests

```typescript
import { test, expect } from 'src/fixtures';

test.describe(() => {
  test('Drivers table is populated', async ({ app, steps }) => {
    await steps.openDriversPage();
    await steps.checkTableIsFilledWithData();
  });
});
```

- Tests requiring authentication → import from `src/fixtures` (auto-login included)
- Tests covering the login page itself → import from `src/fixtures/base` (no auto-login)

### Assertions

```typescript
// Descriptive label for non-obvious assertions
await expect(element, 'Table should have rows').toHaveCount(n);

// Async retry for multi-step interactions
await expect(async () => { /* actions + assertion */ }).toPass();

// Polling until condition is met
await expect.poll(async () => someCondition).toBeTruthy();

// Custom matcher: floating-point comparison with tolerance
expect(received).toBeWithTolerance(expected, { tolerance: 0.1 });
```

### Network Monitor

Tag a test with `@NETWORK_MONITOR` and run with `NETWORK_MONITOR=true` to record all network traffic. Reports land in `./network-report/{tags}/{project}/{timestamp}/` as JSON and CSV, split into backend requests (XHR/fetch/WebSocket) and static assets.

### Route Interception

```typescript
// Mutate outgoing request body
await app.page.route('**/api/v1/example', async route => {
  const postData = route.request().postDataJSON();
  postData.field = 'mutated';
  await route.continue({ postData: JSON.stringify(postData) });
});

// Mutate incoming response body
await app.page.route('**/api/v1/example', async route => {
  const response = await route.fetch();
  const body = await response.json();
  body.field = 'mutated';
  await route.fulfill({ response, body: JSON.stringify(body) });
});
```

### User Builder

```typescript
const user = new UserBuilder('Test', 'test@gmail.com').validate().build();
```

`validate()` asserts that the required env var exists before the test starts. `build()` returns the plain `User` object.

---

## Conventions

| Topic | Rule |
|---|---|
| Timeouts | Underscored literals — `5_000`, `20_000`, `60_000` |
| Waiting | `element.waitFor({ state })` or `expect.poll()` — never `page.waitForTimeout()` |
| Locators | `getByTestId` → `getByRole` → semantic `locator` — never CSS classes |
| Imports | Always use the `src/*` path alias — no `../../` traversals |
| Step reuse | Actions used more than once belong in a step class with `@step()` |
| `test.only` | Forbidden — `forbidOnly: true` is enforced in CI |
