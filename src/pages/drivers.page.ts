import { Locator } from "@playwright/test";
import { BaseViewPage } from "./base-view.page";

export class DriversPage extends BaseViewPage{
  readonly pageURL = 'users/drivers';
  readonly table = this.locator('tbody');
  readonly tableRows = this.table.locator('tr');

  getTableRow(rowNumber: number): Locator {
    return this.tableRows.nth(rowNumber);
  }

  getTableRowCells(rowNumber: number): Locator {
    return this.getTableRow(rowNumber).locator('td');
  }

  getTableCell(rowNumber: number, columnNumber: number): Locator {
    return this.getTableRowCells(rowNumber).nth(columnNumber);
  }
}
