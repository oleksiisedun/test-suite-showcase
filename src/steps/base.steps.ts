import { TestInfo } from 'src/fixtures';
import { App } from 'src/helpers/app';

export abstract class BaseSteps {
  constructor(
    protected readonly app: App,
    protected readonly testInfo: TestInfo
  ) {}
}
