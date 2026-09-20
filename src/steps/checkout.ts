import { expect } from '@playwright/test';
import { getNumber } from 'src/helpers/utils';
import { BaseSteps } from './base.steps';
import { step } from 'src/helpers/utils';

type CheckoutInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutSteps extends BaseSteps {
  @step('Fill checkout information')
  async fillCheckoutInfo(info: CheckoutInfo) {
    await this.app.checkoutStepOnePage.firstNameField.fill(info.firstName);
    await this.app.checkoutStepOnePage.lastNameField.fill(info.lastName);
    await this.app.checkoutStepOnePage.postalCodeField.fill(info.postalCode);
  }

  @step('Attempt to continue checkout')
  async attemptContinueToOverview() {
    await this.app.checkoutStepOnePage.continueButton.click();
  }

  @step('Continue to checkout overview')
  async continueToOverview() {
    await Promise.all([
      this.app.checkoutStepOnePage.page.waitForURL('**/checkout-step-two.html'),
      this.app.checkoutStepOnePage.continueButton.click(),
    ]);
  }

  @step('Check checkout info error message')
  async checkCheckoutInfoError(message: string) {
    await expect(this.app.checkoutStepOnePage.errorMessage).toContainText(message);
  }

  @step('Check order total matches subtotal plus tax')
  async checkOrderTotal() {
    const subtotal = getNumber(await this.app.checkoutStepTwoPage.subtotalLabel.innerText());
    const tax = getNumber(await this.app.checkoutStepTwoPage.taxLabel.innerText());
    const total = getNumber(await this.app.checkoutStepTwoPage.totalLabel.innerText());

    expect(total).toBeWithTolerance(subtotal + tax, { tolerance: 0.01 });
  }

  @step('Finish checkout')
  async finishCheckout() {
    await Promise.all([
      this.app.checkoutStepTwoPage.page.waitForURL('**/checkout-complete.html'),
      this.app.checkoutStepTwoPage.finishButton.click(),
    ]);
  }

  @step('Check order complete')
  async checkOrderComplete() {
    await expect(this.app.checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  }
}
