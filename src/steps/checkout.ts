import { expect } from '@playwright/test';
import { clickAndWaitForURL, getNumber } from 'src/helpers/utils';
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
    await clickAndWaitForURL(this.app.checkoutStepOnePage.continueButton, '**/checkout-step-two.html');
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
    await clickAndWaitForURL(this.app.checkoutStepTwoPage.finishButton, '**/checkout-complete.html');
  }

  @step('Check order complete')
  async checkOrderComplete() {
    await expect(this.app.checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  }
}
