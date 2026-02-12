import { expect, Locator, Page } from "@playwright/test";
import EbooksHeader from "@components/ui/EBooksHeader";

export default class RedeemAdditionalContentPage {
  readonly page: Page;
  readonly header: EbooksHeader;
  readonly heading: Locator;
  readonly orderNumberInput: Locator;
  readonly isbnInput: Locator;
  readonly textInputMessage: Locator;
  readonly redeemButton: Locator;
  readonly orderNumberError: Locator;
  readonly isbnError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: "Redeem Additional Content",
      exact: true
    });
    this.orderNumberInput = page.getByTestId("order-number-input");
    this.isbnInput = page.getByTestId("ISBN-field-input");
    this.textInputMessage = page.getByTestId("text-input-message");
    this.redeemButton = page.getByRole("button", { name: "Redeem" });
    this.orderNumberError = page.locator("#orderNumberError");
    this.isbnError = page.locator("#isbnError");
  }

  async goto() {
    await this.page.goto(`${process.env.EBOOKS_BASEURL}redeem-additional-content`);
    await expect(this.heading).toBeVisible();
  }
}
