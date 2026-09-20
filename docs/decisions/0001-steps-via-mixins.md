# 0001: Assemble `Steps` from mixins

## Context

Tests drive the app through a single `steps` fixture (`steps.addItemToCart(...)`, `steps.finishCheckout()`), so a
test reads as a flat list of actions. The step methods are grouped by area (login, inventory, cart, checkout) so each
file stays small and single-purpose.

Alternatives considered:

- **One large `Steps` class.** Simple, but it mixes every area in one file that grows with each new page.
- **Composition** (`steps.cart.open()`, `steps.checkout.finish()`). No tricks needed, but tests must know which group
  a step lives in, and the flat call style is lost.

## Decision

Each area is its own class extending `BaseSteps` (`LoginSteps`, `InventorySteps`, `CartSteps`, `CheckoutSteps`).
`src/steps/index.ts` declares an empty `Steps` class plus a merged `interface Steps extends ...` that gives it every
method's type. `applyMixins` (`src/helpers/utils.ts`) then copies the prototype methods onto `Steps` at runtime — the
standard TypeScript mixin recipe.

Two consequences of this pattern look like mistakes but are intentional:

- **`@typescript-eslint/no-unsafe-declaration-merging` is off for `src/steps/index.ts` only.** The class/interface
  merge is the mechanism that carries the types, not an accident.
- **Files under `src/steps/` import `expect` from `@playwright/test`, not from `src/fixtures`.** `src/fixtures`
  imports `Steps`, so importing back from it would create a circular import. Test files still import from
  `src/fixtures`.

## Consequences

- Tests keep the flat `steps.<action>()` API, and each step file stays small.
- A new step class must be registered in three places in `src/steps/index.ts`: the `interface Steps extends` list, the
  `applyMixins` array and the import. Forgetting the `interface` entry gives a type error. Forgetting the
  `applyMixins` entry compiles but fails at runtime with "not a function".
- Method names must be unique across all step classes. A later class silently overwrites an earlier one on
  `Steps` with no error.
- `applyMixins` uses `any` (one documented ESLint disable) because constructors are untyped by design.
