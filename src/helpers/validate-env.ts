const REQUIRED_VARS = ['URL', 'USERS_PASSWORD'] as const;

/** Fail-fast validation of required environment config, called once from
 * globalSetup — an unset var aborts the run with one clear message instead of
 * surfacing later as a confusing mid-test failure. */
export function validateEnvVars(): void {
  const missing = REQUIRED_VARS.filter(name => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}. Check your .env file.`);
  }
}
