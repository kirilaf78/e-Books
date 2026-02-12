import { Locator, Page } from "@playwright/test";
import AcceptCookiesBanner from "@components/ui/AcceptCookiesBanner";

export default class MigrationStaticPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly descriptionTable: Locator;
  readonly ebooksDescriptionLink: Locator;
  readonly ebooksButton: Locator;
  readonly acceptCookiesBanner: AcceptCookiesBanner;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1");
    this.descriptionTable = page.locator(".description-cards");
    this.ebooksDescriptionLink = page.locator(".description a");
    this.ebooksButton = page.getByTestId("button");
    this.acceptCookiesBanner = new AcceptCookiesBanner(page);
  }
}
