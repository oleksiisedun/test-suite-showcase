import { BasePage } from "./base";
import { Navigation } from "../navigation";
import { API } from "../helpers/api";
import { Locator } from "@playwright/test";

export class DriversPage extends BasePage implements Navigation {
  readonly table = this.locator('tbody');
  readonly tableRows = this.table.locator('tr');

  url() {
    return 'users/drivers';
  }

  async waitForLoadState() {
    await this.page.waitForResponse(API.regex.drivers);
  }

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
