import { BaseViewPage } from './base-view.page';

export class CheckoutStepOnePage extends BaseViewPage {
  readonly pageURL = 'checkout-step-one.html';
  readonly firstNameField = this.getByTestId('firstName');
  readonly lastNameField = this.getByTestId('lastName');
  readonly postalCodeField = this.getByTestId('postalCode');
  readonly cancelButton = this.getByTestId('cancel');
  readonly continueButton = this.getByTestId('continue');
  readonly errorMessage = this.getByTestId('error');
}
