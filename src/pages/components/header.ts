import { Base } from '../base';

export class Header extends Base {
  readonly menuButton = this.getByTestId('open-menu');
  readonly closeMenuButton = this.getByTestId('close-menu');
  readonly allItemsLink = this.getByTestId('inventory-sidebar-link');
  readonly aboutLink = this.getByTestId('about-sidebar-link');
  readonly logoutLink = this.getByTestId('logout-sidebar-link');
  readonly resetAppStateLink = this.getByTestId('reset-sidebar-link');
  readonly cartLink = this.getByTestId('shopping-cart-link');
  readonly cartBadge = this.getByTestId('shopping-cart-badge');
}
