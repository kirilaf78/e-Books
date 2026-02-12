import { Locator, Page } from "@playwright/test";

export default class PendoBanner {
  readonly page: Page;
  readonly bannerBody: Locator;
  readonly title: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bannerBody = page.locator("//*[starts-with(@id,'pendo-g-')]");
    this.title = this.bannerBody.locator("h2");
    this.closeButton = this.bannerBody.locator("//button[@aria-label='Close']");
  }
}
