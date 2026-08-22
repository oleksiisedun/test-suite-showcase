import { Page } from '@playwright/test';
import { LoginPage } from 'src/pages/login.page';
import { InventoryPage } from 'src/pages/inventory.page';
import { CartPage } from 'src/pages/cart.page';
import { CheckoutStepOnePage } from 'src/pages/checkout-step-one.page';
import { CheckoutStepTwoPage } from 'src/pages/checkout-step-two.page';
import { CheckoutCompletePage } from 'src/pages/checkout-complete.page';

export class App {
  constructor(readonly page: Page) {}

  readonly loginPage = new LoginPage(this.page);
  readonly inventoryPage = new InventoryPage(this.page);
  readonly cartPage = new CartPage(this.page);
  readonly checkoutStepOnePage = new CheckoutStepOnePage(this.page);
  readonly checkoutStepTwoPage = new CheckoutStepTwoPage(this.page);
  readonly checkoutCompletePage = new CheckoutCompletePage(this.page);

  readonly notification = this.page.getByRole('alert');
}
