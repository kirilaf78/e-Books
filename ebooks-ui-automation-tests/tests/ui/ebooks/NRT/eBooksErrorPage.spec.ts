import { books } from "@constants/books";
import { errorCodes } from "@constants/errorCodes";
import { users } from "@constants/users";
import { requestFailedStatus } from "@constants/wording";
import { expect, test } from "@fixtures/pagesFixture";
import AutoUserOperations from "@helpers/AutoUserOperations";
import { isMobileSafari } from "@helpers/testConditions";

test.beforeEach(async ({ context }) => {
  await test.step("Set auto user cookie", async () => {
    // To prevent Pendo banners display https://elsevier.atlassian.net/browse/ESPMPS-2759
    await AutoUserOperations.setCookies(context);
  });
});

test.describe("UI: eBooks+ Error Page tests @ui @ebooks @nrt @errorpage", () => {
  test("eBooks+ Error Page test", async ({
    eBooksSignInPage,
    libraryPage,
    chapterVideosPage,
    page,
    browserName,
    isMobile
  }) => {
    const errorCode = errorCodes.ERROR_500;

    // Simulate code redemption request failure
    await page.route("**/vst-redemptions", async (route) => {
      await route.fulfill({
        status: errorCode
      });
    });

    await test.step("Go to the base url", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
    });

    await test.step("Sign in and check that library is shown", async () => {
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.standard.username,
        users.standard.password
      );
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    await test.step("Try to reedeem a code", async () => {
      await libraryPage.redeemAccessCode("111111");
    });

    await test.step("Error page is shown", async () => {
      await expect(libraryPage.errorPage.body).toBeVisible();
    });

    await test.step("Error status message is displayed", async () => {
      await expect(libraryPage.errorPage.errorMessage).toHaveText(
        `Error: ${requestFailedStatus(errorCode)}`
      );
    });

    await test.step("Page title is expected", async () => {
      expect(await page.title()).toBe("Something went wrong | Elsevier eBooks+");
    });

    await test.step("Page URL is expected", async () => {
      isMobileSafari({ browserName, isMobile })
        ? expect(page.url()).toBe(`${process.env.EBOOKS_BASEURL}?no-cookies=1`)
        : expect(page.url()).toBe(process.env.EBOOKS_BASEURL);
    });

    await test.step("Click 'Retry' button", async () => {
      await libraryPage.errorPage.retryButton.click();
    });

    await test.step("User library is shown", async () => {
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    await test.step("Reedeem a code", async () => {
      await libraryPage.redeemAccessCode("111111");
    });

    await test.step("Click 'Back to Previous' button", async () => {
      await libraryPage.errorPage.backToPreviousButton.click();
    });

    await test.step("User library is shown", async () => {
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    //Change the rooted URL
    await page.unroute("**/vst-redemptions");

    await test.step("Go to videos page", async () => {
      await libraryPage.entitlementItem
        .filter({ hasText: books["Diagnostic Ultrasound"].title })
        .click();
      //Simulate contents-metadata request failure
      await page.route("**/content/V2/ancillary-contents-metadata/**", async (route) => {
        await route.fulfill({
          status: errorCode
        });
      });
      await libraryPage.modal.entitlementVideosLink.click();
    });

    await test.step("Error page is shown", async () => {
      await expect(chapterVideosPage.errorPage.body).toBeVisible();
    });

    await test.step("Click 'Retry' button", async () => {
      await libraryPage.errorPage.retryButton.click();
    });

    await test.step("Error page is shown", async () => {
      await expect(chapterVideosPage.errorPage.body).toBeVisible();
    });

    await test.step("Click 'Back to Previous' button", async () => {
      await libraryPage.errorPage.backToPreviousButton.click();
    });

    await test.step("Error page is shown", async () => {
      await expect(chapterVideosPage.errorPage.body).toBeVisible();
    });
  });
});
