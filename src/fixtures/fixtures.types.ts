import { Steps } from 'src/steps';
import { App } from 'src/helpers/app';
import { users } from 'src/helpers/users';

export type TestOptions = {
  user: keyof typeof users;
}

export type TestFixtures = {
  app: App;
  steps: Steps;
  /** Auto fixture. Activated only when the test is tagged `@NETWORK_MONITOR` and `NETWORK_MONITOR` env var is set. */
  networkMonitor: void;
  /** Auto fixture. Waits for the alert notification to be hidden whenever it appears. */
  notificationHandler: void;
}
