import { expect } from '@playwright/test';
import { goto } from 'src/helpers/utils';
import { BaseSteps } from './base.steps';
import { step } from 'src/helpers/utils';

type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventorySteps extends BaseSteps {
  @step('Open inventory page')
  async openInventoryPage() {
    await Promise.all([this.app.inventoryPage.waitForLoadState(), goto(this.app.inventoryPage)]);
  }

  @step('Add item to cart')
  async addItemToCart(name: string) {
    await this.app.inventoryPage.getAddToCartButton(name).click();
  }

  @step('Remove item from cart')
  async removeItemFromCart(name: string) {
    await this.app.inventoryPage.getRemoveButton(name).click();
  }

  @step('Check cart badge count')
  async checkCartBadgeCount(count: number) {
    await expect(this.app.inventoryPage.header.cartBadge).toHaveText(String(count));
  }

  @step('Sort products')
  async sortProductsBy(option: SortOption) {
    await this.app.inventoryPage.sortDropdown.selectOption(option);
  }
}
