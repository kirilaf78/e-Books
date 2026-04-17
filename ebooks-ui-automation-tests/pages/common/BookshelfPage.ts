import { FrameLocator, Locator, Page } from "@playwright/test";

export default class BookshelfPage {
  readonly page: Page;
  readonly tocPanel: Locator;
  readonly tocButton: Locator;
  readonly bookNavigation: Locator;
  readonly readerFrame: FrameLocator;
  readonly expandAllButton: Locator;
  readonly collapseAllButton: Locator;
  readonly expandedTocItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tocPanel = page.locator("nav[aria-label='Table of Contents'], div[aria-label='Table of Contents']");
    this.tocButton = page.locator("button[aria-label='Table of Contents']");
    this.bookNavigation = page.getByLabel("Book navigation");
    this.readerFrame = page
      .frameLocator('iframe[title="Document reading pane"]')
      .frameLocator("iframe");
    this.expandAllButton = page.getByRole("button", { name: /expand all/i });
    this.collapseAllButton = page.getByRole("button", { name: /collapse all/i });
    this.expandedTocItems = this.tocPanel.locator("[aria-expanded='true']");
  }

  bookTitleHeading(title: string): Locator {
    return this.page.getByRole("heading", { name: title }).first();
  }

  readerFrameHeading(name: string, exact?: boolean): Locator {
    return this.readerFrame.getByRole("heading", { name, exact });
  }

  tocChapterLink(name: RegExp): Locator {
    return this.tocPanel.getByRole("button", { name });
  }

  tocSubChapterLink(name: string): Locator {
    return this.tocPanel.getByText(name, { exact: true });
  }
}
