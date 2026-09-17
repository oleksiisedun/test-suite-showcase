import { validateEnvVars } from './validate-env';
import { checkSiteReachable } from './check-site-reachable';

/** Runs once before the whole test run. Validates required environment config and that the
 * app under test is reachable, so a bad setup fails fast with a clear message instead of
 * surfacing as confusing test timeouts. */
async function globalSetup() {
  validateEnvVars();
  await checkSiteReachable();
}

export default globalSetup;
