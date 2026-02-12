import { Locator, Page } from "@playwright/test";

export default class BreadCrumbsMenu {
  readonly page: Page;
  readonly list: Locator;
  readonly link: Locator;

  constructor(page: Page) {
    this.page = page;
    this.list = page.locator(".c-els-breadcrumb__list");
    this.link = this.list.locator(".c-els-breadcrumb__item").getByRole("link");
  }
}
