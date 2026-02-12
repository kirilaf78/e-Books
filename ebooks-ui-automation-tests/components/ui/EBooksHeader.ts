import { Locator, Page } from "@playwright/test";
import MyAccountPage from "@pages/common/MyAccountPage";

import BreadCrumbsMenu from "./BreadCrumbsMenu";

export default class EbooksHeader {
  readonly page: Page;
  readonly headerNavigation: Locator;
  readonly languageSelector: Locator;
  readonly selectedLanguage: Locator;
  readonly languageSelectorItem: Locator;
  readonly logoLink: Locator;
  readonly sandwichMenu: Locator;
  readonly closeDrawerMenuButton: Locator;
  readonly userInfoButton: Locator;
  readonly breadcrumbsMenu: BreadCrumbsMenu;
  readonly loginButton: Locator;
  readonly dropdownContanerFirstItem: Locator;
  readonly myAccountLink: Locator;
  readonly signOutButton: Locator;
  readonly dropdownContainer: Locator;
  readonly migrationSettingsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoLink = page.getByTestId("header").getByRole("link", { name: "eBooks+" });
    this.headerNavigation = page.getByTestId("header-navigation");
    this.languageSelector = this.headerNavigation.locator(".language-selector");
    this.selectedLanguage = this.languageSelector.locator(".autotest-default-language");
    this.languageSelectorItem = this.languageSelector.locator("li").getByRole("button");
    this.sandwichMenu = page.getByTestId("open-drawer-btn");
    this.closeDrawerMenuButton = page.getByTestId("modal-close-button");
    this.userInfoButton = page.locator("#user-info");
    this.breadcrumbsMenu = new BreadCrumbsMenu(page);
    this.loginButton = page.getByTestId("sign-in-button");
    this.dropdownContainer = page.getByTestId("dropdown-container");
    this.dropdownContanerFirstItem = this.dropdownContainer.locator("li").first();
    this.myAccountLink = page.locator("#my-account-link");
    this.signOutButton = page
      .getByTestId("dropdown-container")
      .locator(".signout-btn")
      .getByRole("button");
    this.migrationSettingsLink = page.getByTestId("migration-settings-link");
  }

  async openMyAccountLink() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.waitForLoadState(),
      this.myAccountLink.click()
    ]);
    return new MyAccountPage(newPage);
  }

  async signOut() {
    await this.userInfoButton.click();
    await this.signOutButton.click();
  }
}
