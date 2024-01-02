import { getTestsStepsProxy } from "../helpers/utils";
import { loginSteps } from "./login";
import { sidebarSteps } from "./sidebar";
import { driversSteps } from "./drivers";

export const steps = getTestsStepsProxy({
  ...loginSteps,
  ...sidebarSteps,
  ...driversSteps
});
