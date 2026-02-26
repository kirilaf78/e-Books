import { Languages } from "@constants/languages";
import { users } from "@constants/users";
import { wording } from "@constants/wording";
import { expect, test } from "@fixtures/pagesFixture";
import AutoUserOperations from "@helpers/AutoUserOperations";

test.describe("UI: eBooks+ Localization feature @ui @ebooks @nrt @localization", () => {
  test.beforeEach(async ({ context }) => {
    await test.step("Set auto user cookie", async () => {
      // To prevent Pendo banners display https://elsevier.atlassian.net/browse/ESPMPS-2759
      await AutoUserOperations.setCookies(context);
    });
  });
  test("Localization feature", async ({ eBooksSignInPage, libraryPage, page, isMobile }) => {
    await test.step("Open eBooks+ base URL", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
    });

    await test.step("Accept all cookies", async () => {
      await eBooksSignInPage.acceptCookiesBanner.acceptAllButton.click();
    });

    await test.step("Check that Welcome page header is displayed in English", async () => {
      await expect(eBooksSignInPage.heading).toHaveText(wording.welcomeToEbooks.en);
    });

    await test.step("Open side bar", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as side bar is mobile only");
      await eBooksSignInPage.header.sandwichMenu.click();
    });

    await test.step("Check the English language is set by default", async () => {
      await expect(eBooksSignInPage.header.selectedLanguage).toHaveText("EN- Choose a language");
    });

    await test.step("Check that available languages list is expected", async () => {
      await eBooksSignInPage.header.languageSelector.click();
      const languagesOptions = await eBooksSignInPage.header.languageSelectorItem.allTextContents();
      expect(languagesOptions).toMatchObject(Object.values(Languages));
    });

    await test.step("Change page language to German", async () => {
      await eBooksSignInPage.header.languageSelectorItem
        .filter({ hasText: Languages.GERMAN })
        .click();
    });

    await test.step("Close side bar", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as side bar is mobile only");
      await eBooksSignInPage.header.closeDrawerMenuButton.click();
    });

    await test.step("Check that the page header is displayed in German", async () => {
      await expect(eBooksSignInPage.heading).toHaveText(wording.welcomeToEbooks.de);
    });

    await test.step("Sign In", async () => {
      await eBooksSignInPage.signIn(users.standard.username, users.standard.password);
    });

    await test.step("Check that the Library page header is displayed in German", async () => {
      await expect(libraryPage.heading).toHaveText(wording.welcomeToYourLibrary.de);
    });

    await test.step("Open side bar", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as side bar is mobile only");
      await eBooksSignInPage.header.sandwichMenu.click();
    });

    await test.step("Change page language to Spanish", async () => {
      await libraryPage.header.languageSelector.click();
      await libraryPage.header.languageSelectorItem.filter({ hasText: Languages.SPANISH }).click();
    });

    await test.step("Close side bar", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as side bar is mobile only");
      await eBooksSignInPage.header.closeDrawerMenuButton.click();
    });

    await test.step("Check that the Library page header is displayed in Spanish", async () => {
      await expect(libraryPage.heading).toHaveText(wording.welcomeToYourLibrary.es);
    });

    await test.step("Open side bar", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as side bar is mobile only");
      await eBooksSignInPage.header.sandwichMenu.click();
    });

    await test.step("Change page language to Japanese", async () => {
      await libraryPage.header.languageSelector.click();
      await libraryPage.header.languageSelectorItem.filter({ hasText: Languages.JAPANESE }).click();
    });

    await test.step("Close side bar", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as side bar is mobile only");
      await eBooksSignInPage.header.closeDrawerMenuButton.click();
    });

    await test.step("Check that the Library page header is displayed in Japanese", async () => {
      await expect(libraryPage.heading).toHaveText(wording.welcomeToYourLibrary.jp);
    });

    await test.step("Sign out", async () => {
      await libraryPage.header.signOut();
    });

    await test.step("Check that the Welcome page header is displayed in Japanese", async () => {
      await expect(eBooksSignInPage.heading).toHaveText(wording.welcomeToEbooks.jp);
    });
  });
});
