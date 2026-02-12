import { Locator, Page } from "@playwright/test";

export default class ErrorPage {
  readonly page: Page;
  readonly body: Locator;
  readonly retryButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;
  readonly backToPreviousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.body = page.getByTestId("error-template");
    this.retryButton = page.getByTestId("retry-btn");
    this.errorMessage = page.getByTestId("error-status");
    this.errorButton = page.getByTestId("error-button");
    this.backToPreviousButton = this.errorButton.filter({ hasText: "Back to Previous" });
  }
}
