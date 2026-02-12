import { Locator, Page } from "@playwright/test";

export default class SsoPage {
  readonly page: Page;
  readonly heading: Locator;
  //Ebooks
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginLink: Locator;
  readonly submitButton: Locator;

  //ESP Admin
  readonly loginSocialButton: Locator;
  readonly emailSocialInput: Locator;
  readonly passwordSocialInput: Locator;
  readonly nextButton: Locator;
  readonly signInSocialButton: Locator;
  readonly authCodeInput: Locator;
  readonly verifyButton: Locator;
  readonly authCodeError: Locator;
  readonly addAccountDetailsHeading: Locator;

  // StudentConsult.es
  readonly loginButtonStudentConsult: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator(".login-id").getByRole("heading");
    //Ebooks Log In flow
    this.usernameInput = page.locator("//input[@name='username']");
    this.passwordInput = page.locator("//input[@name='password']");
    this.loginButton = page.getByRole("button", { name: "Log In" });
    this.loginLink = page.locator("a:has(div:text('Log In'))");
    this.addAccountDetailsHeading = page.locator("h1:has-text('Add account details')");
    this.submitButton = page.locator(
      "//button[@type='submit' and @data-action-button-primary='true']"
    );

    //ESP Admin flow
    this.loginSocialButton = page.locator(
      "a:has(div:text('Log in at ReedElsevier.onmicrosoft.com'))"
    );
    this.emailSocialInput = page.locator("//input[@name='loginfmt']");
    this.passwordSocialInput = page.getByPlaceholder("Password");
    this.nextButton = page.locator("//input[@value='Next']");
    this.signInSocialButton = page.locator("//input[@value='Sign in']");
    this.authCodeInput = page.locator("//input[@aria-label='Code']");
    this.verifyButton = page.locator("//input[@value='Verify']");
    this.authCodeError = page.getByText(
      "You didn't enter the expected verification code. Please try again."
    );

    //StudenConsult.es
    this.loginButtonStudentConsult = page.getByRole("button", { name: "Iniciar sesión" });
  }

  async signInToEbooksAuth0(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async signInToEbooksNeoID(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.submitButton.click();
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
