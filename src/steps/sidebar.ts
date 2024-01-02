import { expect } from "@playwright/test";
import { Sidebar } from "../pages/base/sidebar";

export const sidebarSteps = {
  'company name is shown in the sidebar': async (sidebar: Sidebar) => {
    await expect(sidebar.companyName).toBeVisible();
  }
};
