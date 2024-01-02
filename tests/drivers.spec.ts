import { test } from '../src/base-test';
import { steps } from '../src/steps';

test('Verify that drivers table is filled with data', async ({ loginPage, driversPage }) => {
  await steps['Login test user'](loginPage);
  await steps['Open drivers page'](driversPage);
  await steps['Verify table is filled with data'](driversPage);
});
