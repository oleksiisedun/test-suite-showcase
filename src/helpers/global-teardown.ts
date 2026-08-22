/** Runs once after the whole test run. No-op for now — SauceDemo has no server-side
 * test data to clean up. Add cleanup calls here (e.g. via the `API` helper) if this
 * suite starts creating state that outlives a single test. */
async function globalTeardown() {}

export default globalTeardown;
