import { BaseViewPage } from './base-view.page';

export class CheckoutStepTwoPage extends BaseViewPage {
  readonly pageURL = 'checkout-step-two.html';
  readonly subtotalLabel = this.getByTestId('subtotal-label');
  readonly taxLabel = this.getByTestId('tax-label');
  readonly totalLabel = this.getByTestId('total-label');
  readonly cancelButton = this.getByTestId('cancel');
  readonly finishButton = this.getByTestId('finish');
}
