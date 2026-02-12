import { expect, Locator, Page } from "@playwright/test";
import AcceptCookiesBanner from "@components/ui/AcceptCookiesBanner";
import EbooksHeader from "@components/ui/EBooksHeader";
import SsoPage from "@pages/common/SSOPage";

export default class EBooksSignInPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly signInButton: Locator;
  readonly header: EbooksHeader;
  readonly ssoPage: SsoPage;
  readonly acceptCookiesBanner: AcceptCookiesBanner;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator(".sign-in-page").locator("h1");
    this.header = new EbooksHeader(page);
    this.acceptCookiesBanner = new AcceptCookiesBanner(page);
    this.ssoPage = new SsoPage(page);

    // Sign In buttons
    const signInButton = page.getByTestId("sign-in-btn");
    const signInButtonsGroup = page.locator(".sign-in-page-buttons");
    this.signInButton = signInButtonsGroup.locator(signInButton);
  }

  async signIn(username: string, password: string) {
    await this.signInButton.click();
    await expect(this.ssoPage.heading).toBeVisible();
    await this.ssoPage.signInToEbooksNeoID(username, password);
    await expect(this.ssoPage.heading).toBeHidden();
    (await this.ssoPage.addAccountDetailsHeading.isVisible())
      ? this.ssoPage.submitButton.click()
      : null;
  }

  async acceptCookiesAndSignIn(username: string, password: string) {
    await this.acceptCookiesBanner.acceptAllButton.click();
    await this.signIn(username, password);
  }
}
