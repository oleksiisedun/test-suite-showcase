import { test, expect } from 'src/fixtures';

test.describe(() => {
  test('Cart page reflects items added from inventory', async ({ steps }) => {
    await steps.addItemToCart('Sauce Labs Backpack');
    await steps.addItemToCart('Sauce Labs Bike Light');
    await steps.openCartPage();
    await steps.checkCartContainsItems(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  });

  test('Removing an item from the cart page updates the cart', async ({ app, steps }) => {
    await steps.addItemToCart('Sauce Labs Backpack');
    await steps.openCartPage();
    await steps.removeItemFromCartPage('Sauce Labs Backpack');
    await expect(app.cartPage.cartItems, 'Cart should be empty').toHaveCount(0);
  });
});
