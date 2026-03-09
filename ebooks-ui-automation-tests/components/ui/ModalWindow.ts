import { Locator, Page } from "@playwright/test";

export default class ModalWindow {
  readonly page: Page;
  readonly frame: Locator;
  readonly button: Locator;
  readonly content: Locator;
  readonly heading: Locator;
  readonly viewResultButton: Locator;
  readonly dropdown: Locator;
  readonly dropdownOption: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;
  readonly okButton: Locator;
  readonly viewImportSummaryButton: Locator;
  readonly isbnList: Locator;
  readonly entitlementContentLink: Locator;
  readonly entitlementEbookLink: Locator;
  readonly entitlementNotesLink: Locator;
  readonly entitlementVideosLink: Locator;
  readonly entitlementAudiosLink: Locator;
  readonly entitlementImagesLink: Locator;
  readonly entitlementPDFFilesLink: Locator;
  readonly entitlementDocumentsLink: Locator;
  readonly entitlementExternalLinksLink: Locator;
  readonly description: Locator; //Migration Settings Modal
  readonly homeButton: Locator; //Migration Settings Modal
  readonly removeButton: Locator; //Migration Settings Modal
  readonly continueMigrationButton: Locator; //Migration Settings Modal

  constructor(page: Page) {
    this.page = page;
    this.frame = page.getByTestId("modal-container");
    this.button = this.frame.locator("button");
    this.heading = this.frame.getByRole("heading");
    this.content = this.frame.getByTestId("modal-content");
    this.closeButton = this.frame.getByTestId("modal-close-button");

    //Entitlement Modal
    this.entitlementContentLink = page.locator(".entitlement-content-type-link");
    this.entitlementEbookLink = page.getByTestId("entitlement-link");
    this.entitlementNotesLink = this.entitlementContentLink.filter({ hasText: "Notes" });
    this.entitlementVideosLink = this.entitlementContentLink.filter({ hasText: "Videos" });
    this.entitlementAudiosLink = this.entitlementContentLink.filter({ hasText: "Audios" });
    this.entitlementImagesLink = this.entitlementContentLink.filter({ hasText: "Images" });
    this.entitlementPDFFilesLink = this.entitlementContentLink.filter({ hasText: "PDF Files" });
    this.entitlementDocumentsLink = this.entitlementContentLink.filter({ hasText: "Documents" });
    this.entitlementExternalLinksLink = this.entitlementContentLink.filter({
      hasText: "External links"
    });

    // User Status Update
    this.viewResultButton = this.frame.locator("//button[contains(text(), 'View Result')]");

    // Grant Permission
    this.dropdown = this.frame.locator("//div[contains(@class,'select__input')]");
    this.dropdownOption = this.frame.locator("//button[contains(@id,'-select-options-')]");
    this.continueButton = this.button.filter({ hasText: "Continue" });
    this.cancelButton = this.button.filter({ hasText: "Cancel" });
    this.okButton = this.button.filter({ hasText: "OK" });

    //Import Access Code
    this.viewImportSummaryButton = this.frame.locator(
      "//button[contains(text(), 'View Import Summary')]"
    );

    // Access Code History
    this.isbnList = this.frame.getByTestId("modal-isbns-list");

    //Migration Settings Modal
    this.description = this.frame.locator(".description");
    this.homeButton = this.button.filter({ hasText: "Home" });
    this.removeButton = this.button.filter({ hasText: "Remove" });
    this.continueMigrationButton = this.button.filter({ hasText: "Continue migration" });
  }
}
