import legacyAppsData from "test-data/migration/legacyAppsData";
import { expect, test } from "@fixtures/pagesFixture";
import { isDev, isMobileSafari, isProduction } from "@helpers/testConditions";
import ModalWindow from "@components/ui/ModalWindow";
import MigrationStaticPage from "@pages/common/MigrationStaticPage";

const eBooksSignInPageUrl = "https://ebooks.health.elsevier.com/sign-in";

test.use({
  launchOptions: { slowMo: 250 }
});

test.describe("UI: eBooks+ Static page for migration from legacy apps @ui @ebooks @nrt @migration @staticpage", () => {
  for (const appData of legacyAppsData) {
    test(`Static page of ${appData.title}`, async ({
      eBooksSignInPage,
      page,
      browserName,
      isMobile
    }) => {
      test.skip(
        isDev && appData.title !== "eLibrary",
        "Only QA/PROD envs are used for legacy apps static pages"
      );
      const staticPage = await test.step(`Open ${appData.title} URL`, async () => {
        await page.goto(isDev ? appData.url.dev : isProduction ? appData.url.prod : appData.url.qa);
        return new MigrationStaticPage(page);
      });

      await test.step("Verify the page heading", async () => {
        await expect(staticPage.heading).toHaveText(appData.staticPageHeadingText);
      });

      await test.step("Verify the description table to be visible", async () => {
        await expect(staticPage.descriptionTable).toBeVisible();
      });

      await test.step("Close cookie banner (eLibrary specific)", async (step) => {
        step.skip(appData.title !== "eLibrary", "Skip for non-eLibrary apps");
        await staticPage.acceptCookiesBanner.acceptAllButton.click();
      });

      await test.step("Click on eBooks+ link", async () => {
        await staticPage.ebooksDescriptionLink.click();
      });

      // Initialize modal elements
      const legacyAppModal = new ModalWindow(page);
      const eBooksLink = legacyAppModal.frame
        .locator("a")
        .filter({ hasText: "ebooks.health.elsevier.com" });
      const dontShowAgainCheckbox = legacyAppModal.frame.getByRole("checkbox");
      const dontShowAgainCheckboxLabel = legacyAppModal.frame.getByTestId("checkbox-label");

      await test.step("Accept all cookies", async (step) => {
        step.skip(appData.title === "eLibrary", "Skip for eLibrary as done before");
        await eBooksSignInPage.acceptCookiesBanner.acceptAllButton.click();
      });

      await test.step("Verify that modal heading is correct", async () => {
        await expect(legacyAppModal.heading).toHaveText(appData.modalHeadingText);
      });

      await test.step("Verify that checkbox is unchecked", async () => {
        await expect(dontShowAgainCheckbox).not.toBeChecked();
      });

      await test.step("Click on eBooks link in the modal", async () => {
        await eBooksLink.click();
      });

      await test.step("Verify that modal window is not displayed", async () => {
        await expect(legacyAppModal.frame).toBeHidden();
      });

      await test.step("Open sidebar", async (step) => {
        step.skip(!isMobile, "Skip on desktop, as sidebar is mobile only");
        await eBooksSignInPage.header.sandwichMenu.click();
      });

      await test.step("Verify selected page language", async () => {
        const selectedLanguageID = (
          await eBooksSignInPage.header.selectedLanguage.textContent()
        ).slice(0, 2); // Getting rid of '- Choose a language' part
        expect(selectedLanguageID).toBe(appData.language);
      });

      await test.step("Close sidebar", async (step) => {
        step.skip(!isMobile, "Skip on desktop, as sidebar is mobile only");
        await eBooksSignInPage.header.closeDrawerMenuButton.click();
      });

      await test.step("Verify that brand info is displayed (PIW)", async (step) => {
        step.skip(appData.title !== "PIW", "Skip for non-PIW apps");
        await expect(page.locator(".piw-brand-info")).toBeVisible();
      });

      await test.step("Go back via browser history", async () => {
        await page.goBack();
      });

      await test.step("Verify the page URL", async (step) => {
        step.skip(!isProduction, "Skip URL check in non-PROD, as it uses custom domains");
        const pageURL = isMobileSafari({ browserName, isMobile })
          ? `${eBooksSignInPageUrl}/${appData.id}?no-cookies=1`
          : `${eBooksSignInPageUrl}/${appData.id}`;
        await expect(page).toHaveURL(pageURL);
      });

      await test.step("Click OK button", async () => {
        await legacyAppModal.okButton.click();
      });

      await test.step("Verify that modal window is not displayed", async () => {
        await expect(legacyAppModal.frame).toBeHidden();
      });

      await test.step("Refresh the page", async () => {
        await page.reload();
        await expect(eBooksSignInPage.heading).toBeVisible();
      });

      await test.step("Go back via browser history", async () => {
        await page.goBack();
        // Needs to be done twice in FF because of extra item in browser history
        browserName === "firefox" && (await page.goBack());
      });

      await test.step("Click on eBooks+ button", async () => {
        await staticPage.ebooksButton.click();
      });

      await test.step("Check 'Dont show again' checkbox", async () => {
        await dontShowAgainCheckboxLabel.click();
        await expect(dontShowAgainCheckbox).toBeChecked();
      });

      await test.step("Click on eBooks link in the modal", async () => {
        await eBooksLink.click();
      });

      await test.step("Verify that modal window is not displayed", async () => {
        await expect(legacyAppModal.frame).toBeHidden();
      });

      await test.step("Go back via browser history", async () => {
        await page.goBack();
      });

      await test.step("Check 'Dont show again' checkbox", async () => {
        await expect(dontShowAgainCheckbox).not.toBeChecked();
        await dontShowAgainCheckboxLabel.click();
      });

      await test.step("Click OK button", async () => {
        await legacyAppModal.okButton.click();
      });

      await test.step("Go back via browser history", async () => {
        await expect(legacyAppModal.frame).toBeHidden();
        await page.goBack();
      });

      await test.step("Verify href attribute of eBooks+ link in the description", async (step) => {
        step.skip(
          !isProduction && appData.title !== "eLibrary",
          "Skip in non-PROD, as it uses custom domains"
        );
        await expect(staticPage.ebooksDescriptionLink).toHaveAttribute(
          "href",
          appData.title === "eLibrary"
            ? `/sign-in/${appData.id}`
            : `${eBooksSignInPageUrl}/${appData.id}`
        );
      });

      await test.step("Click on eBooks+ via link", async () => {
        await staticPage.ebooksButton.click();
        await expect(eBooksSignInPage.heading).toBeVisible();
      });

      await test.step("Verify the page URL", async (step) => {
        step.skip(!isProduction, "Skip URL check in non-PROD, as it uses custom domains");
        const pageURL =
          appData.title === "eLibrary"
            ? isMobileSafari({ browserName, isMobile })
              ? `${eBooksSignInPageUrl}/${appData.id}?no-cookies=1`
              : `${eBooksSignInPageUrl}`
            : isMobileSafari({ browserName, isMobile })
              ? `${eBooksSignInPageUrl}?no-cookies=1`
              : `${eBooksSignInPageUrl}`;
        await expect(page).toHaveURL(pageURL);
      });

      await test.step("Verify that modal is not displayed", async () => {
        await expect(legacyAppModal.frame).toBeHidden();
      });
    });
  }
});
