import { expect } from "@playwright/test";
import { goto } from "../pages/navigatable";
import { BaseSteps } from "./base-steps";
import { step } from "../helpers/step";

export class DriversSteps extends BaseSteps {
  @step('Open drivers page')
  async openDriversPage() {
    await Promise.all([this.app.driversPage.waitForLoadState(), goto(this.app.driversPage)]);
  }

  @step('Check table is filled with data')
  async checkTableIsFilledWithData() {
    const rowsCount = await this.app.driversPage.tableRows.count();

    for (let rowNumber = 0; rowNumber < rowsCount; rowNumber += 1) {
      const columnCount = await this.app.driversPage.getTableRowCells(rowNumber).count();

      for (let columnNumber = 0; columnNumber < columnCount; columnNumber += 1) {
        const cell = this.app.driversPage.getTableCell(rowNumber, columnNumber);

        expect.soft(
          await cell.innerText(), 
          `Cell in ${rowNumber + 1} row ${columnNumber + 1} column is empty`
        ).not.toEqual('');
      }
    }
  }
}
