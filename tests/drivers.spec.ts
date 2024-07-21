import { test } from '../src/fixtures/login';

test('Verify that drivers table is filled with data', async ({ steps }) => {
  await steps.openDriversPage();
  await steps.checkTableIsFilledWithData();
});
