import { expect, Locator, Page } from "@playwright/test";
import EbooksHeader from "@components/ui/EBooksHeader";

export default class AccessCodeHelpPage {
  readonly page: Page;
  readonly header: EbooksHeader;
  readonly heading: Locator;
  readonly recoverISBNInput: Locator;
  readonly recoverISBNInputMessage: Locator;
  readonly recoverISBNInputErrorMessage: Locator;
  readonly submitButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new EbooksHeader(page);
    this.heading = page.getByRole("heading", {
      name: "Access Code Help",
      exact: true
    });
    this.recoverISBNInput = page.getByTestId("damaged-input");
    this.recoverISBNInputMessage = page.getByTestId("text-input-message");
    this.recoverISBNInputErrorMessage = page.getByTestId("error-message");
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.finishButton = page.getByRole("button", { name: "Finish" });
  }

  async goto() {
    await this.page.goto(`${process.env.EBOOKS_BASEURL}access-code-help`);
    await expect(this.heading).toBeVisible();
  }

  async recoverISBN(isbn: string) {
    await this.recoverISBNInput.fill(isbn);
    await this.submitButton.click();
  }
}
