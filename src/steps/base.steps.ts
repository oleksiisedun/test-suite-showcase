import { TestInfo } from 'src/fixtures';
import { API } from 'src/helpers/api';
import { App } from 'src/helpers/app';

export abstract class BaseSteps {
  constructor(
    protected readonly app: App,
    protected readonly api: API,
    protected readonly testInfo: TestInfo
  ) {}
}
