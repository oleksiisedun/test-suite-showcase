import { getBaseURL } from './utils';

const REACHABILITY_CHECK_TIMEOUT = 5_000;

/** Fails fast with a clear message when the app under test isn't reachable, instead of
 * letting every test hang until Playwright's test timeout (e.g. a stale/unreachable `URL`
 * in `.env`, or no network connectivity), called once from `globalSetup`. */
export async function checkSiteReachable(): Promise<void> {
  const url = getBaseURL();

  try {
    await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(REACHABILITY_CHECK_TIMEOUT) });
  } catch {
    throw new Error(`Cannot reach ${url} — check the URL in your .env file and your network connection.`);
  }
}
