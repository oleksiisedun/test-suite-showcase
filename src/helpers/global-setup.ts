import { validateEnvVars } from './validate-env';

/** Runs once before the whole test run. Validates required environment config so a bad
 * setup fails fast with a clear message instead of surfacing as confusing test failures. */
async function globalSetup() {
  validateEnvVars();
}

export default globalSetup;
