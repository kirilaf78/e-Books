import { Locator, Page } from "@playwright/test";

export default class Checkbox {
  readonly page: Page;
  readonly container: Locator;
  readonly checked: Locator;
  readonly unchecked: Locator;
  readonly label: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator("//div[contains(@class, 'checkbox__wrapper')]");
    this.checked = page.locator("//input[@data-autotest-state='checked']");
    this.unchecked = page.locator("//input[@data-autotest-state='unchecked']");
    this.label = page.getByTestId("checkbox-label");
  }
}
