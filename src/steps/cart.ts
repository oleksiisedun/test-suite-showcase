import { expect } from '@playwright/test';
import { clickAndWaitForURL, openPage } from 'src/helpers/utils';
import { BaseSteps } from './base.steps';
import { step } from 'src/helpers/utils';

export class CartSteps extends BaseSteps {
  @step('Open cart page')
  async openCartPage() {
    await openPage(this.app.cartPage);
  }

  @step('Check cart contains items')
  async checkCartContainsItems(names: string[]) {
    await expect(this.app.cartPage.cartItems, 'Cart should contain the expected number of items').toHaveCount(
      names.length
    );

    for (const name of names) {
      await expect(this.app.cartPage.getCartItem(name)).toBeVisible();
    }
  }

  @step('Remove item from cart page')
  async removeItemFromCartPage(name: string) {
    await this.app.cartPage.getRemoveButton(name).click();
  }

  @step('Proceed to checkout')
  async proceedToCheckout() {
    await clickAndWaitForURL(this.app.cartPage.checkoutButton, '**/checkout-step-one.html');
  }
}
