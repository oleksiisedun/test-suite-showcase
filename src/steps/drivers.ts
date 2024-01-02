import { expect } from "@playwright/test";
import { goto } from "../navigation";
import { DriversPage } from "../pages/drivers.page";

export const driversSteps = {
  'Open drivers page': async (driversPage: DriversPage) => {
    await Promise.all([driversPage.waitForLoadState(), goto(driversPage)]);
  },
  'Verify table is filled with data': async (driversPage: DriversPage) => {
    const rowsCount = await driversPage.tableRows.count();

    for (let rowNumber = 0; rowNumber < rowsCount; rowNumber += 1) {
      const columnCount = await driversPage.getTableRowCells(rowNumber).count();

      for (let columnNumber = 0; columnNumber < columnCount; columnNumber += 1) {
        const cell = driversPage.getTableCell(rowNumber, columnNumber);

        expect.soft(
          await cell.innerText(), 
          `Cell in ${rowNumber + 1} row ${columnNumber + 1} column is empty`
        ).not.toEqual('');
      }
    }
  }
}
