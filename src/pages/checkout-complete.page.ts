import { BaseViewPage } from './base-view.page';

export class CheckoutCompletePage extends BaseViewPage {
  readonly pageURL = 'checkout-complete.html';
  readonly completeHeader = this.getByTestId('complete-header');
  readonly backToProductsButton = this.getByTestId('back-to-products');
}
