import { Locator, Page } from "@playwright/test";
import EbooksHeader from "@components/ui/EBooksHeader";

export default class NotFoundPage {
  readonly page: Page;
  readonly frame: Locator;
  readonly heading: Locator;
  readonly header: EbooksHeader;

  constructor(page: Page) {
    this.page = page;
    this.frame = page.getByTestId("not-found-page");
    this.header = new EbooksHeader(page);
    this.heading = page.getByRole("heading", { name: "This page cannot be found." });
  }
}
