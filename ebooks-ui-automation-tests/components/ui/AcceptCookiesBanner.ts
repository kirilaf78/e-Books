import { Locator, Page } from "@playwright/test";

export default class AcceptCookiesBanner {
  readonly page: Page;
  readonly acceptAllButton: Locator;
  readonly cookiesSettingsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptAllButton = page.locator("#onetrust-accept-btn-handler");
    this.cookiesSettingsButton = page.locator("#onetrust-pc-btn-handler");
  }
}
