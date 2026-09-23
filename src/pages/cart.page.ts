import { BaseViewPage } from './base-view.page';

export class CartPage extends BaseViewPage {
  readonly pageURL = 'cart.html';
  readonly cartItems = this.getByTestId('inventory-item');
  readonly continueShoppingButton = this.getByTestId('continue-shopping');
  readonly checkoutButton = this.getByTestId('checkout');

  getCartItem(name: string) {
    return this.getItemByName(this.cartItems, name);
  }

  getRemoveButton(name: string) {
    return this.getRemoveButtonFor(this.cartItems, name);
  }
}
