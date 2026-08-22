import { test } from 'src/fixtures';

test.describe(() => {
  test('Completing checkout with valid information shows the confirmation page', async ({ steps }) => {
    await steps.addItemToCart('Sauce Labs Backpack');
    await steps.openCartPage();
    await steps.proceedToCheckout();
    await steps.fillCheckoutInfo({ firstName: 'Test', lastName: 'User', postalCode: '12345' });
    await steps.continueToOverview();
    await steps.checkOrderTotal();
    await steps.finishCheckout();
    await steps.checkOrderComplete();
  });

  test('Checkout requires a first name', async ({ steps }) => {
    await steps.addItemToCart('Sauce Labs Backpack');
    await steps.openCartPage();
    await steps.proceedToCheckout();
    await steps.fillCheckoutInfo({ firstName: '', lastName: 'User', postalCode: '12345' });
    await steps.attemptContinueToOverview();
    await steps.checkCheckoutInfoError('Error: First Name is required');
  });
});
