import { books } from "@constants/books";
import { users } from "@constants/users";
import { expect, test } from "@fixtures/pagesFixture";
import AutoUserOperations from "@helpers/AutoUserOperations";
import { isCI, isDesktopSafari, isMobileSafari, isNotChromium } from "@helpers/testConditions";

const bookWithVideos = books["Diagnostic Ultrasound"];
const bookWithAudio = books["Deutsch B1/B2 in der Pflege"];

const videoPageUrl = `${process.env.EBOOKS_BASEURL}${bookWithVideos.vbid}/video/chapters?chapterPii=${bookWithVideos.getChapterPii()}&id=${process.env.VIDEO_ID}`;

test.use({
  launchOptions: { slowMo: 500 }
});

test.describe("Video Content @ui @ebooks @nrt @videocontent", () => {
  test.beforeEach(async ({ context }) => {
    await test.step("Set auto user cookie", async () => {
      // To prevent Pendo banners display https://elsevier.atlassian.net/browse/ESPMPS-2759
      await AutoUserOperations.setCookies(context);
    });
  });
  test.describe("Subtitles @subtitles", () => {
    /**
     * The following test checks that all subtitles related requests are made from the page.
     * NOTE: The test is not relevant for Mobile Safari due to the iOS playback mechanic. The .vtt request on iOS is made only after specific language is chosen by user via video player's menu.
     * Desktop Chromium browsers are only used.
     */
    test.skip(isNotChromium, "Test is for Chromium browsers only");
    test("Video subtitles are requested by the page", async ({
      page,
      eBooksSignInPage,
      libraryPage
    }) => {
      await test.step("Sign in and check the library", async () => {
        await page.goto(process.env.EBOOKS_BASEURL);
        await eBooksSignInPage.acceptCookiesAndSignIn(
          users.ebooks_username_1,
          users.ebooks_password_1
        );
        await expect(libraryPage.entitlementlist).toBeVisible();
      });
      // Subtitles related requests. Start waiting before opening the video page.
      const responseFromToken = page.waitForResponse("**/token/generate?contentId=**");
      const responseFromStatic = page.waitForResponse("**/**.vtt?t=**");

      await test.step("Go to Video page", async () => {
        await page.goto(videoPageUrl);
      });

      await test.step("Check requests to video subtitles", async () => {
        expect((await responseFromToken).status()).toBe(200);
        const responseWithSubs = await responseFromStatic;
        expect(responseWithSubs.status()).not.toBe(401);
        expect(responseWithSubs.status()).not.toBe(500);
      });
    });
  });

  test.describe("Video playback @videoplayback", () => {
    test.skip(true, "Skipped as the steps have been covered by CUJ1 scenario");
    test("Video file is playable", async ({
      page,
      eBooksSignInPage,
      libraryPage,
      videoContentPage
    }) => {
      await test.step("Sign in and check the library", async () => {
        await page.goto(process.env.EBOOKS_BASEURL);
        await eBooksSignInPage.acceptCookiesAndSignIn(
          users.ebooks_username_1,
          users.ebooks_password_1
        );
        await expect(libraryPage.entitlementlist).toBeVisible();
      });

      await test.step("Go to Video page", async () => {
        await page.goto(videoPageUrl);
      });

      await test.step("Check that the video is paused", async () => {
        await expect(videoContentPage.video).toBeVisible({ timeout: 20000 });
        await expect(videoContentPage.mediaContainerPaused).toBeVisible();
      });

      await test.step("Click on the Video frame", async () => {
        await videoContentPage.video.click();
      });

      await test.step("Check that video is playing", async () => {
        await expect(videoContentPage.mediaContainerError).toBeHidden();
        await expect(videoContentPage.mediaContainerPlaying).toBeVisible();
      });
    });
  });
});

test.describe("Audio Content @ui @ebooks @nrt @audiocontent", () => {
  test.describe("Audio playback @audioplayback", () => {
    test("Audio file is playable", async ({
      eBooksSignInPage,
      libraryPage,
      audioContentPage,
      browserName,
      isMobile,
      page
    }) => {
      test.slow();
      await test.step("Sign in and check the library", async () => {
        await page.goto(process.env.EBOOKS_BASEURL);
        await eBooksSignInPage.acceptCookiesAndSignIn(
          users.ebooks_username_1,
          users.ebooks_password_1
        );
        await expect(libraryPage.entitlementlist).toBeVisible();
      });

      await test.step("Open audio page", async () => {
        await libraryPage.entitlementItem.filter({ hasText: bookWithAudio.title }).click();
        await libraryPage.modal.entitlementAudiosLink.click();
      });

      await test.step("Check that the audio is paused", async () => {
        await expect(audioContentPage.audio).toBeVisible();
        await expect(audioContentPage.mediaContainerPaused).toBeVisible();
      });

      await test.step("Check that audio is buffered", async () => {
        await expect(audioContentPage.mediaContainerBuffered).toBeVisible();
      });

      await test.step("Click on the audio frame", async () => {
        // Clicking with coordinates according to media player specifics
        const clickingPosition = isDesktopSafari({ browserName, isMobile })
          ? { x: 50, y: 45 }
          : isMobileSafari({ browserName, isMobile })
            ? { x: 22, y: 43 }
            : { x: 28, y: 38 };
        await audioContentPage.audio.click({ position: clickingPosition });
      });

      await test.step("Check that audio is playing", async (step) => {
        step.skip(
          // Skipping step for Firefox in CI environments due to the error "Media resource could not be decoded" after clicking the audio element
          browserName === "firefox" && isCI,
          "Skipping step for Firefox in CI due to audio decoding issues"
        );
        await expect(audioContentPage.mediaContainerError).toBeHidden();
        await expect(audioContentPage.mediaContainerPlaying).toBeVisible();
      });
    });
  });
});
