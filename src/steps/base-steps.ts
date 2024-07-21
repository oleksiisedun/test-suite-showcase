import { API } from "../helpers/api";
import { App } from "../helpers/app";

export abstract class BaseSteps {
  constructor(protected readonly app: App, protected readonly api: API) {}
}
