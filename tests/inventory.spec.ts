import { test, expect } from 'src/fixtures';
import { getNumber } from 'src/helpers/utils';

test.describe(() => {
  test('Inventory page lists all products after login', async ({ app }) => {
    await expect(app.inventoryPage.items, 'Six products should be listed').toHaveCount(6);
  });

  test('Adding an item to the cart updates the cart badge', async ({ app, steps }) => {
    await steps.addItemToCart('Sauce Labs Backpack');
    await steps.checkCartBadgeCount(1);
    await expect(app.inventoryPage.getRemoveButton('Sauce Labs Backpack')).toBeVisible();
  });

  test('Removing an item from the cart clears the cart badge', async ({ app, steps }) => {
    await steps.addItemToCart('Sauce Labs Backpack');
    await steps.removeItemFromCart('Sauce Labs Backpack');
    await expect(app.inventoryPage.header.cartBadge).toBeHidden();
  });

  test('Sorting by price low to high orders products by price', async ({ app, steps }) => {
    await steps.sortProductsBy('lohi');

    const prices = (await app.inventoryPage.itemPrices.allInnerTexts()).map(getNumber);

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
