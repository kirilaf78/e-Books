import { Locator, Page } from "@playwright/test";
import EbooksHeader from "@components/ui/EBooksHeader";
import ModalWindow from "@components/ui/ModalWindow";

export default class MigrationSettingsPage {
  readonly page: Page;
  readonly body: Locator;
  readonly header: EbooksHeader;
  readonly heading: Locator;
  readonly banner: Locator;
  readonly modal: ModalWindow;
  readonly entitlementsList: Locator;
  readonly migrateButton: Locator;
  readonly removeButton: Locator;
  entitlement: (title?: string) => { item: Locator; migrateButton: Locator; removeButton: Locator };

  constructor(page: Page) {
    this.page = page;
    this.header = new EbooksHeader(page);
    this.modal = new ModalWindow(page);
    this.body = page.getByTestId("migration-settings-page");
    this.heading = this.body.locator("h1");
    this.banner = this.body.getByTestId("banner");

    this.entitlementsList = this.body.locator(".migration-entitlements");

    this.entitlement = (title?: string) => {
      const item = title
        ? this.body.locator(".migration-entitlements-item").filter({ hasText: title })
        : this.body.locator(".migration-entitlements-item");
      const migrateButton = item.getByTestId("migrate-button");
      const removeButton = item.getByTestId("confirm-remove-button");
      return { item, migrateButton, removeButton };
    };
  }
}
