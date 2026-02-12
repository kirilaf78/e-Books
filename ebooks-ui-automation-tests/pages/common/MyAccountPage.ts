import { Locator, Page } from "@playwright/test";

export default class MyAccountPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly productShowcaseContainer: Locator;
  readonly eBooksTextLink: Locator;
  readonly eBooksImgLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("header").locator("span").filter({ hasText: "Elsevier account" });
    this.productShowcaseContainer = page.getByTestId("product-showcase");
    this.eBooksTextLink = this.productShowcaseContainer
      .locator("a")
      .filter({ has: this.page.locator("span").filter({ hasText: "eBooks+" }) });
    this.eBooksImgLink = this.productShowcaseContainer
      .locator("a")
      .filter({ has: this.page.locator("//img[@alt='eBooks+']") });
  }
}
