import { expect, Locator, Page } from "@playwright/test";
import EbooksHeader from "@components/ui/EBooksHeader";
import ErrorPage from "@components/ui/ErrorPage";
import ModalWindow from "@components/ui/ModalWindow";
import PendoBanner from "@components/ui/PendoBanner";
import BookshelfPage from "@pages/common/BookshelfPage";
import SupportCenterPage from "@pages/common/SupportCenterPage";

export default class LibraryPage {
  readonly page: Page;
  readonly header: EbooksHeader;
  readonly heading: Locator;
  readonly redeemAccessCodeInput: Locator;
  readonly redeemButton: Locator;
  readonly noAccessCodeLink: Locator;
  readonly redeemErrorMessage: Locator;
  readonly emptyLibraryMessage: Locator;
  readonly entitlementlist: Locator;
  readonly entitlementItem: Locator;
  readonly errorPage: ErrorPage;
  readonly modal: ModalWindow;
  readonly migrationBanner: Locator;
  readonly migrationBannerCloseButton: Locator;
  readonly migrationSettingsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator(".home-page").locator("h1");
    this.header = new EbooksHeader(page);
    this.redeemAccessCodeInput = page.getByTestId("redeem-input");
    this.redeemButton = page.getByRole("button", { name: "Redeem" });
    this.noAccessCodeLink = page.getByRole("link", { name: "No Access Code?" });
    this.redeemErrorMessage = page.locator("#redeem-access-code-error");
    this.emptyLibraryMessage = page.getByTestId("entitlement-list-empty");
    this.errorPage = new ErrorPage(page);
    this.migrationBanner = page.locator(".migration-banner");
    this.migrationBannerCloseButton = this.migrationBanner
      .locator("button")
      .filter({ hasText: "Close" });
    this.migrationSettingsLink = this.migrationBanner
      .locator("a")
      .filter({ hasText: "Migration Settings" });

    //Entitlements
    this.entitlementlist = page.getByTestId("entitlement-list");
    this.entitlementItem = page.getByTestId("entitlement-item");

    //Modal
    this.modal = new ModalWindow(page);
  }

  async openEbooksLink() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.waitForLoadState(),
      this.modal.entitlementEbookLink.click()
    ]);
    return new BookshelfPage(newPage);
  }

  async redeemAccessCode(accessCode: string) {
    await this.redeemAccessCodeInput.fill(accessCode);
    await expect(this.redeemAccessCodeInput).toHaveValue(accessCode);
    await expect(this.redeemButton).toBeEnabled();
    await this.redeemButton.click();
  }

  async openNoAccessCodeLink() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.waitForLoadState(),
      this.noAccessCodeLink.click()
    ]);
    return new SupportCenterPage(newPage);
  }

  async closePendoBanner() {
    const pndBanner = new PendoBanner(this.page);
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(1000);
    if (await pndBanner.bannerBody.isVisible()) {
      await pndBanner.closeButton.click();
    }
    await expect(pndBanner.bannerBody).toBeHidden();
  }
}
