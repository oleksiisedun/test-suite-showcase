import { BaseViewPage } from './base-view.page';

export class InventoryPage extends BaseViewPage {
  readonly pageURL = 'inventory.html';
  readonly sortDropdown = this.getByTestId('product-sort-container');
  readonly items = this.getByTestId('inventory-item');
  readonly itemPrices = this.getByTestId('inventory-item-price');

  getItem(name: string) {
    return this.getItemByName(this.items, name);
  }

  getAddToCartButton(name: string) {
    return this.getItem(name).getByRole('button', { name: 'Add to cart' });
  }

  getRemoveButton(name: string) {
    return this.getRemoveButtonFor(this.items, name);
  }
}
