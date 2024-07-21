import { applyMixins } from "../helpers/utils";
import { BaseSteps } from "./base-steps";
import { LoginSteps } from "./login";
import { DriversSteps } from "./drivers";

class Steps extends BaseSteps {};

interface Steps extends LoginSteps, DriversSteps {};

applyMixins(Steps, [LoginSteps, DriversSteps]);

export { Steps };
