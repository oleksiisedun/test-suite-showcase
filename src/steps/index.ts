import { applyMixins } from 'src/helpers/utils';
import { BaseSteps } from './base.steps';
import { LoginSteps } from './login';
import { InventorySteps } from './inventory';
import { CartSteps } from './cart';
import { CheckoutSteps } from './checkout';

class Steps extends BaseSteps {}

interface Steps extends LoginSteps, InventorySteps, CartSteps, CheckoutSteps {}

applyMixins(Steps, [LoginSteps, InventorySteps, CartSteps, CheckoutSteps]);

export { Steps };
