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
        .toHaveURL(new RegExp(`${externalLinks.bookshelf}/reader/books/${bookISBN}`));
      await bookshelfPage.page.close();
    });

await test.step("Check the availability of ancillaries stored on S3", async () => {
      // 1. Before clicking the video link, set up a network listener to catch the response from S3
      // Added status 304 in case the video is served from the cache during repeated runs
      const responsePromise = page.waitForResponse((response) => {
        const url = response.url();
        const isMediaUrl =
          url.startsWith("https://static.us.elsevierhealth.com/") &&
          (url.includes(".mp4") || url.includes(".m3u8"));
        const isSuccessStatus = [200, 206, 304, 0].includes(response.status());

        return isMediaUrl && isSuccessStatus;
      });

      // 2. Open the video page (this action triggers the network request to S3)
      await libraryPage.modal.entitlementVideosLink.click();

      // Wait for the interface to appear
      await expect(videoContentPage.videoContainer).toBeVisible({ timeout: 15000 });

      // Проверяем, что видео работает (пропускаем на Safari и Mobile Chromium)
      if (
        !isDesktopSafari({ browserName, isMobile }) &&
        !isMobileChromium({ browserName, isMobile }) &&
        !isMobileSafari({ browserName, isMobile })
      ) {
        await expect(videoContentPage.video).toBeVisible({ timeout: 20000 });
        await expect(videoContentPage.mediaContainerPaused).toBeVisible(); // Check that the video is paused
        await expect(videoContentPage.mediaContainerBuffered).toBeVisible(); // Wait for buffering

        // 3. Force the video to play using JavaScript (eliminating unstable clicks)
        await videoContentPage.video.evaluate((element: HTMLMediaElement) => element.play());

        // 4. Wait for the response from the server (or cache), which we started listening to in step 1
        await responsePromise;

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
