import { books } from "@constants/books";
import { externalLinks } from "@constants/externalLinks";
import { users } from "@constants/users";
import { expect, test } from "@fixtures/pagesFixture";
import AutoUserOperations from "@helpers/AutoUserOperations";
import { isDesktopSafari, isMobileChromium, isMobileSafari } from "@helpers/testConditions";

/**
 * @jira ESPMPS-1824
 * @description eBooks+ P1 Critical User Journey
 */

const bookWithS3Content = books["Diagnostic Ultrasound"];
const bookWithCourseWareContent = books["Neurología"];

test.use({
  launchOptions: { slowMo: 250 }
});

test.describe("eBooks+ P1 Critical User Journey @ui @critical @ebooks @p1 @cuj1", () => {
  test("Access to eBooks+ library content", async ({
    eBooksSignInPage,
    libraryPage,
    videoContentPage,
    imageContentPage,
    context,
    browserName,
    isMobile,
    page
  }) => {
    await test.step("Set auto user cookie", async () => {
      // To prevent Pendo banners display https://elsevier.atlassian.net/browse/ESPMPS-2759
      await AutoUserOperations.setCookies(context);
    });

    await test.step("Open eBooks+ base URL", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
      await expect(eBooksSignInPage.heading).toBeVisible();
    });

    await test.step("Sign in and check that library is shown", async () => {
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.standard.username,
        users.standard.password
      );
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    await test.step("Check the redirection to Bookshelf application", async () => {
      const entitlement = libraryPage.entitlementItem.filter({
        hasText: bookWithS3Content.title
      });
      const bookISBN = await entitlement.getAttribute("id"); // Save book ISBN for later
      await entitlement.click();
      const bookshelfPage = await libraryPage.openEbooksLink();
      await expect
        .soft(bookshelfPage.page)
        .toHaveURL(`${externalLinks.bookshelf}/reader/books/${bookISBN}/pages/recent`);
      await bookshelfPage.page.close();
    });

    await test.step("Check the availability of ancillaries stored on S3", async () => {
      const ancillarySourceUrlS3 = `https://static.us.elsevierhealth.com/**`;
      const videoSource = (domain: string) => {
        return isMobileSafari({ browserName, isMobile })
          ? `${domain}/**.mp4?t=**`
          : `${domain}/**.m3u8?t=**`;
      };
      const responseFromS3 = page.waitForResponse(videoSource(ancillarySourceUrlS3));

      // Open video page via modal link
      await libraryPage.modal.entitlementVideosLink.click();

      // Check that video container is visible after loading
      const status = (await responseFromS3).status();
      expect([206, 200, 0]).toContain(status); // Zero is added for CI runs on Mobile Safari
      await expect(videoContentPage.videoContainer).toBeVisible();

      // Check that the video is playable (Skipped on Desktop Safari and Mobile Chromium due to video frame error)
      if (
        !isDesktopSafari({ browserName, isMobile }) &&
        !isMobileChromium({ browserName, isMobile })
      ) {
        await expect(videoContentPage.video).toBeVisible({ timeout: 20000 });
        await expect(videoContentPage.mediaContainerPaused).toBeVisible(); // Check that the video is paused
        await expect(videoContentPage.mediaContainerBuffered).toBeVisible(); // Wait until the video is buffered
        await videoContentPage.video.click();
        await expect(videoContentPage.mediaContainerPlaying).toBeVisible();
      }
    });

    await test.step("Go to 'Home' page via breadcrumbs menu", async () => {
      await videoContentPage.header.breadcrumbsMenu.link.filter({ hasText: "Home" }).click();
    });

    await test.step("Check the availability of ancillaries stored on Courseware", async () => {
      const responseFromCW = page.waitForResponse("https://coursewareobjects.elsevier.com/**");
      // Open images page via modal link
      await libraryPage.entitlementItem
        .filter({ hasText: bookWithCourseWareContent.title })
        .click();
      await libraryPage.modal.entitlementImagesLink.click();

      // Check that the image element is visible after loading
      const response = await responseFromCW;
      expect(response.status()).toBe(200);
      await expect(imageContentPage.image).toBeVisible();
    });

    await test.step("Check user info content", async () => {
      await imageContentPage.header.userInfoButton.click();
      await expect(imageContentPage.header.dropdownContanerFirstItem).toHaveText(
        users.standard.username
      );
    });

    await test.step("Click Sign out link", async () => {
      await imageContentPage.header.signOutButton.click();
    });

    await test.step("Check that Sign in page opens", async () => {
      await expect(eBooksSignInPage.heading).toBeVisible();
    });
  });
});
