import { test } from 'src/fixtures';

test.skip('Verify that drivers table is filled with data', async ({ steps }) => {
  await steps.openDriversPage();
  await steps.checkTableIsFilledWithData();
});
