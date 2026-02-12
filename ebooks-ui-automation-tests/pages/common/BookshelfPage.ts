import { Locator, Page } from "@playwright/test";

export default class BookshelfPage {
  readonly page: Page;
  readonly tocPanelDesktop: Locator;
  readonly tocPanelMobile: Locator;
  readonly tocButton: Locator;
  readonly bookNavigation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tocPanelDesktop = page.locator("nav[aria-label='Table of Contents']");
    this.tocPanelMobile = page.locator("div[aria-label='Table of Contents']");
    this.tocButton = page.locator("button[aria-label='Table of Contents']");
    this.bookNavigation = page.getByLabel("Book navigation");
  }
}
