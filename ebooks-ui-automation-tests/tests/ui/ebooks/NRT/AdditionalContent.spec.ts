import { books } from "@constants/books";
import { externalLinks } from "@constants/externalLinks";
import { users } from "@constants/users";
import { wording } from "@constants/wording";
import { expect, test } from "@fixtures/pagesFixture";
import AutoUserOperations from "@helpers/AutoUserOperations";
import { isMobileSafari } from "@helpers/testConditions";
import { Page } from "@playwright/test";

test.use({
  launchOptions: { slowMo: 500 }
});

const bookWithVideoByChapters = books["Diagnostic Ultrasound"];
const bookWithAudioNoChapters = books["Deutsch B1/B2 in der Pflege"];
const bookWithImagesDefaultChapter = books["Neurología"];
const bookWithPdfNoChapters = books["Deutsch B1/B2 in der Pflege"];
const bookWithEBook = books["Diagnostic Ultrasound"];
const bookWithDocuments = books["Pflege Heute"];
const bookWithExternalLinks = books["Macleod. Exploración clínica"];

const videoPageUrl = `${process.env.EBOOKS_BASEURL}${bookWithVideoByChapters.vbid}/video/chapters?chapterPii=${bookWithVideoByChapters.getChapterPii()}&id=${process.env.VIDEO_ID}`;
const ancillarySourceUrlCW = `https://coursewareobjects.elsevier.com/**`;

const imageSource = (domain: string) => {
  return `${domain}**/**.{png,jpg,jpeg,svg,gif}**`;
};

const mediaListUrl = `${process.env.APIS_BASEURL}content/V2/ancillary-contents-metadata?**`;

test.describe("Additional Content @ui @ebooks @nrt @additionalcontent", () => {
  test.beforeEach(async ({ context }) => {
    await test.step("Set auto user cookie", async () => {
      // To prevent Pendo banners display https://elsevier.atlassian.net/browse/ESPMPS-2759
      await AutoUserOperations.setCookies(context);
    });
  });

  test("Video page @videopage", async ({
    eBooksSignInPage,
    libraryPage,
    videoContentPage,
    page,
    browserName,
    isMobile
  }) => {
    await test.step("Sign in", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.standard.username,
        users.standard.password
      );
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    await test.step("Open video page", async () => {
      await libraryPage.entitlementItem.filter({ hasText: bookWithVideoByChapters.title }).click();
      await libraryPage.modal.entitlementVideosLink.click();
    });

    await test.step("Check the page URL", async () => {
      isMobileSafari({ browserName, isMobile })
        ? await expect(page).toHaveURL(`${videoPageUrl}&no-cookies=1`)
        : await expect(page).toHaveURL(videoPageUrl);
    });

    await test.step("Check that video player is shown", async () => {
      await expect(videoContentPage.videoContainer).toBeVisible();
    });

    await test.step("Check that list of all book authors is displayed", async () => {
      for (const author of bookWithVideoByChapters.authors) {
        await expect(videoContentPage.videoSource).toHaveText(new RegExp(author));
      }
    });

    await test.step("Check the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await expect(videoContentPage.drawerButton).toHaveText("Chapters");
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await videoContentPage.drawerButton.click();
    });

    await test.step("Check content menu header text", async () => {
      await expect(videoContentPage.contentMenu.heading).toHaveText("Chapters");
    });

    await test.step("Check if titles list is sorted", async () => {
      const videoTitles = await videoContentPage.contentMenu.panelItemLink.allTextContents();
      expect(videoTitles.length).toBeGreaterThan(1);
      const sortedVideoTitles = videoTitles.sort((a, b) => a.localeCompare(b));
      expect(videoTitles).toEqual(sortedVideoTitles);
    });

    await test.step("Collapse first chapter panel", async () => {
      await videoContentPage.contentMenu.panelTitle.first().click();
    });

    await test.step("Check that all panels are collapsed", async () => {
      await expect(videoContentPage.contentMenu.expandedPanel).toHaveCount(0);
    });

    await test.step("Expand another chapter panel", async () => {
      await videoContentPage.contentMenu.panelTitle.nth(3).click();
    });

    const videoTitle = await videoContentPage.contentMenu.panelItemLink.first().textContent();

    await test.step("Open a video from expanded panel", async () => {
      await videoContentPage.contentMenu.panelItemLink.filter({ hasText: videoTitle }).click();
    });

    await test.step("Check that video title is expected", async () => {
      await expect(videoContentPage.videoTitle).toHaveText(`Video - ${videoTitle.split(":")[1]}`);
    });

    await test.step("Refresh the page", async () => {
      await page.reload();
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await videoContentPage.drawerButton.click();
    });

    await test.step("Check that only expected panel is expanded", async () => {
      await expect(videoContentPage.contentMenu.expandedPanel).toHaveCount(1);
      await expect(
        videoContentPage.contentMenu.panelItemLink.filter({ hasText: videoTitle })
      ).toBeVisible();
    });

    await test.step("Simulate opening a book without video chapters", async () => {
      await page.goto(
        `${process.env.EBOOKS_BASEURL}${bookWithVideoByChapters.vbid}/video/chapters?chapterPii=none&id=${process.env.VIDEO_ID}`
      );
    });

    await test.step("Check that video player is shown", async () => {
      await expect(videoContentPage.videoContainer).toBeVisible();
    });

    await test.step("Check the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await expect(videoContentPage.drawerButton).toHaveText("All Videos");
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await videoContentPage.drawerButton.click();
    });

    await test.step("Check content menu header text", async () => {
      await expect(videoContentPage.contentMenu.heading).toHaveText("All Videos");
    });

    await test.step("Check that no chapter panels are shown", async () => {
      await expect(videoContentPage.contentMenu.panel).toBeHidden();
    });

    await test.step("Check that videos list is displayed", async () => {
      await expect(videoContentPage.contentMenu.allContentItemsList).toBeVisible();
    });
  });

  test("Audio page @audiopage", async ({
    eBooksSignInPage,
    libraryPage,
    audioContentPage,
    page,
    isMobile
  }) => {
    await test.step("Sign in", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.standard.username,
        users.standard.password
      );
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    await test.step("Open audio page", async () => {
      await libraryPage.entitlementItem.filter({ hasText: bookWithAudioNoChapters.title }).click();
      await libraryPage.modal.entitlementAudiosLink.click();
    });

    await test.step("Check that audio player is shown", async () => {
      await expect(audioContentPage.audio).toBeVisible();
    });

    await test.step("Check the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await expect(audioContentPage.drawerButton).toHaveText("All Audios");
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await audioContentPage.drawerButton.click();
    });

    await test.step("Check content menu header text", async () => {
      await expect(audioContentPage.contentMenu.heading).toHaveText("All Audios");
    });

    await test.step("Check that the first content item is active", async () => {
      await expect(audioContentPage.contentMenu.itemLink.first()).toHaveAttribute(
        "class",
        "active"
      );
    });

    const audioTitle = await audioContentPage.contentMenu.itemLink.nth(1).textContent();

    await test.step("Open another item link", async () => {
      await audioContentPage.contentMenu.itemLink.nth(1).click();
    });

    await test.step("Check that audio title is expected", async () => {
      await expect(audioContentPage.audioTitle).toHaveText(`Audio - ${audioTitle}`);
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await audioContentPage.drawerButton.click();
    });

    await test.step("Check that the opened link is active", async () => {
      await expect(audioContentPage.contentMenu.itemLink.nth(1)).toHaveAttribute("class", "active");
    });

    await test.step("Reload the page", async () => {
      await page.reload();
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await audioContentPage.drawerButton.click();
    });

    await test.step("Check that the opened link is still active", async () => {
      await expect(audioContentPage.contentMenu.itemLink.nth(1)).toHaveAttribute("class", "active");
    });
  });

  test("Image page @imagepage", async ({
    eBooksSignInPage,
    libraryPage,
    imageContentPage,
    isMobile,
    page
  }) => {
    await test.step("Sign in", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.standard.username,
        users.standard.password
      );
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    const responseFromImageSource = page.waitForResponse(imageSource(ancillarySourceUrlCW));

    await test.step("Open image page", async () => {
      await libraryPage.entitlementItem
        .filter({ hasText: bookWithImagesDefaultChapter.title })
        .click();
      await libraryPage.modal.entitlementImagesLink.click();
    });

    await test.step("Check the image source response", async () => {
      expect((await responseFromImageSource).status()).toBe(200);
    });

    await test.step("Check that the image frame is displayed", async () => {
      await expect(imageContentPage.imageContainer).toBeVisible();
    });

    const firstImageTitle = await imageContentPage.imageTitle.textContent();
    // Remove "Image - " prefix from sidebar title for comparison
    const firstImageTitleWithoutPrefix = firstImageTitle.replace("Image - ", "");

    await test.step("Check the drawer button label", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await expect(imageContentPage.drawerButton).toHaveText("Chapters");
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await imageContentPage.drawerButton.click();
    });

    await test.step("Check that the first content menu item is active", async () => {
      await expect(imageContentPage.contentMenu.panelItemLink.first()).toContainClass("active");
    });

    await test.step("Check that image title is expected", async () => {
      const sideBarFirstImageTitle = await imageContentPage.contentMenu.panelItemLink
        .first()
        .textContent();
      expect(sideBarFirstImageTitle).toContain(firstImageTitleWithoutPrefix);
    });

    await test.step("Check if titles list is sorted", async () => {
      const imageTitles = await imageContentPage.contentMenu.panelItemLink.allTextContents();
      const sortedImageTitles = imageTitles.sort((a, b) => a.localeCompare(b));
      expect(imageTitles).toEqual(sortedImageTitles);
    });

    // Simulate image request failure
    await page.route(ancillarySourceUrlCW, async (route) => {
      await route.fulfill({
        status: 404
      });
    });

    const sideBarSecondImageTitle = await imageContentPage.contentMenu.panelItemLink
      .nth(1)
      .textContent();

    await test.step("Open the second image from the list", async () => {
      await imageContentPage.contentMenu.panelItemLink.nth(1).click();
      await expect(imageContentPage.imageTitle).toContainText(`Image - ${sideBarSecondImageTitle}`);
    });

    await test.step("Check that content item error frame is displayed", async () => {
      await expect(imageContentPage.contentItemErrorFrame).toBeVisible();
      await expect(imageContentPage.contentItemErrorTitle).toHaveText(
        wording.contentItemError.imageUnavailable
      );
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await imageContentPage.drawerButton.click();
    });

    await test.step("Check that the second content menu item is active", async () => {
      await expect(imageContentPage.contentMenu.panelItemLink.first()).not.toContainClass("active");
      await expect(imageContentPage.contentMenu.panelItemLink.nth(1)).toContainClass("active");
    });

    await test.step("Reload the page", async () => {
      await page.reload();
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await imageContentPage.drawerButton.click();
    });

    await test.step("Check that the second content menu item is still active", async () => {
      await expect(imageContentPage.contentMenu.panelItemLink.nth(1)).toContainClass("active");
    });

    //Simulate media list request failure
    await page.unroute(ancillarySourceUrlCW);
    await page.route(mediaListUrl, async (route) => {
      await route.fulfill({
        status: 500
      });
    });

    await test.step("Reload the page", async () => {
      await page.reload();
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await imageContentPage.drawerButton.click();
    });

    await test.step("Check that media list error frame is shown", async () => {
      await expect(imageContentPage.mediaListErrorFrame).toBeVisible();
    });

    await page.unroute(mediaListUrl);

    await test.step("Click on Retry button", async () => {
      await imageContentPage.mediaListRetryButton.click();
    });

    await test.step("Close drawer", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await imageContentPage.header.closeDrawerMenuButton.click();
    });

    await test.step("Check that the image frame is displayed", async () => {
      await expect(imageContentPage.imageContainer).toBeVisible();
    });

    await test.step("Click on the drawer button", async (step) => {
      step.skip(!isMobile, "Skip on desktop, as drawer button is not displayed");
      await imageContentPage.drawerButton.click();
    });

    await test.step("Check that content items list is displayed", async () => {
      await expect(imageContentPage.contentMenu.panelItemsList).toBeVisible();
    });
  });

  test("PDF page @pdfpage", async ({
    eBooksSignInPage,
    libraryPage,
    pdfContentPage,
    isMobile,
    page,
    request
  }) => {
    await test.step("Sign in", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.standard.username,
        users.standard.password
      );
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    const pdfListResponse = await test.step("Open PDF page", async () => {
      await libraryPage.entitlementItem.filter({ hasText: bookWithPdfNoChapters.title }).click();
      const mediaListResponse = page.waitForResponse(
        (response) =>
          response.url().includes("/V2/ancillary-contents-metadata?offset") &&
          response.request().method() === "GET"
      );
      await libraryPage.modal.entitlementPDFFilesLink.click();
      const response = await mediaListResponse;
      return response;
    });

    await test.step("Verify that the first PDF file is available", async () => {
      //Get first PDF URL from the response
      const mediaListData = await pdfListResponse.json();
      const firstPdfUrl = mediaListData.metadata[0].locations.assetIdUrl;
      //Verify the url is accessible
      const pdfResponse = await request.get(firstPdfUrl);
      expect(pdfResponse.status()).toBe(200);
    });

    await test.step("Check that PDF page title is correct", async () => {
      const pdfTitle = isMobile
        ? await pdfContentPage.pdfMobileViewTitle.textContent()
        : await pdfContentPage.pdfTitle.textContent();
      expect(pdfTitle).toContain(`${bookWithPdfNoChapters.title} - PDF files`);
    });

    await test.step("Check if PDF titles list is sorted", async () => {
      const pdfTitles = await pdfContentPage.contentMenu.itemButton.allTextContents();
      const sortedPdfTitles = [...pdfTitles].sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
      });
      expect(pdfTitles).toEqual(sortedPdfTitles);
    });

    /**
     * The following step only checks that a new tab is opened without checking the content of the PDF file. This is caused by the fact that Playwright has no pdf viewer for headless mode as for now.
     */
    await test.step("Open first PDF file in a new tab", async () => {
      const [newPage] = await Promise.all([
        page.context().waitForEvent("page"),
        page.waitForLoadState(),
        pdfContentPage.contentMenu.itemButton.first().click()
      ]);
      newPage.close();
    });

    //Simulate media list request failure
    await page.route(mediaListUrl, async (route) => {
      await route.fulfill({
        status: 500
      });
    });

    await test.step("Reload the page", async () => {
      await page.reload();
    });

    await test.step("Check that media list error frame is shown", async () => {
      await expect(pdfContentPage.mediaListErrorFrame).toBeVisible();
    });
  });

  test("eBook page @ebookpage", async ({
    eBooksSignInPage,
    libraryPage,
    page,
    context,
    isMobile
  }) => {
    let newPage: Page;

    await test.step("Sign in", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.standard.username,
        users.standard.password
      );
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    const bookISBN = await test.step("Open eBook", async () => {
      const entitlement = libraryPage.entitlementItem.filter({
        hasText: bookWithEBook.title
      });
      const isbn = await entitlement.getAttribute("id");
      await entitlement.click();
      return isbn;
    });

    await test.step("Click on the eBook link and verify Bookshelf redirection", async () => {
      const pagePromise = context.waitForEvent("page");
      await libraryPage.modal.entitlementEbookLink.click();

      newPage = await pagePromise;
      await expect
        .soft(newPage)
        .toHaveURL(new RegExp(`${externalLinks.bookshelf}/reader/books/${bookISBN}`));

      // on mobile the book title is hidden in the menu, so we only check it on desktop
      if (!isMobile) {
        await expect(
          newPage.getByRole("heading", { name: bookWithEBook.title }).first()
        ).toBeVisible();
      }
    });

    // quick content check only for mobile devices
    await test.step("Verify that the eBook content is loaded (Mobile only)", async (step) => {
      step.skip(!isMobile, "Skip on desktop, full navigation is checked in subsequent steps");

      const readerFrame = newPage
        .frameLocator('iframe[title="Document reading pane"]')
        .frameLocator("iframe");

      await expect(
        readerFrame.getByRole("heading", { name: "Physics of Ultrasound" })
      ).toBeVisible();
    });

    await test.step("Verify Expand all and Collapse all features in Bookshelf", async (step) => {
      step.skip(isMobile, "Skip on mobile, as the Table of Contents sidebar is hidden by default");

      const tocPanel = newPage.locator("nav[aria-label='Table of Contents']");
      await expect(tocPanel).toBeVisible();

      const expandAllButton = newPage.getByRole("button", { name: /expand all/i });
      await expandAllButton.click();
      await expect(tocPanel.locator("[aria-expanded='true']").first()).toBeVisible();

      const collapseAllButton = newPage.getByRole("button", { name: /collapse all/i });
      await collapseAllButton.click();

      // wait for the number of expanded elements to become 0 (clean launch) or 1 (saved progress)
      await expect(async () => {
        const count = await tocPanel.locator("[aria-expanded='true']").count();
        expect(count).toBeLessThanOrEqual(1);
      }).toPass({ timeout: 10000 });
    });

    await test.step("Verify chapter title synchronization and sub-chapter navigation", async (step) => {
      step.skip(isMobile, "Skip on mobile, as the Table of Contents sidebar is hidden by default");

      const tocPanel = newPage.locator("nav[aria-label='Table of Contents']");
      const readerFrame = newPage
        .frameLocator('iframe[title="Document reading pane"]')
        .frameLocator("iframe");

      const expandAllButton = tocPanel.getByRole("button", { name: /expand all/i });
      await expandAllButton.click();

      const chapter1Link = tocPanel.getByRole("button", {
        name: /Go to Chapter 1 Physics of/i
      });
      await chapter1Link.click();

      await expect(
        readerFrame.getByRole("heading", { name: "Physics of Ultrasound" })
      ).toBeVisible();

      const instrumentation = tocPanel.getByText("Instrumentation", { exact: true });
      await instrumentation.click();

      await expect(
        readerFrame.getByRole("heading", { name: "Instrumentation", exact: true })
      ).toBeVisible();
    });

    await test.step("Close Bookshelf tab", async () => {
      await newPage.close();
    });
  });

  test("Documents page @documentspage", async ({ eBooksSignInPage, libraryPage, page }) => {
    await test.step("Sign in", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.standard.username,
        users.standard.password
      );
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    await test.step("Open Documents page", async () => {
      await libraryPage.entitlementItem.filter({ hasText: bookWithDocuments.title }).click();
      await libraryPage.modal.entitlementDocumentsLink.click();
    });

    await test.step("Check the page title/breadcrumb", async () => {
      await expect(page.getByText(`${bookWithDocuments.title}: Documents`)).toBeVisible();
    });

    await test.step("Check that documents list is displayed", async () => {
      await expect(page.locator(".content-menu")).toBeVisible();
    });

    await test.step("Verify document download", async () => {
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.getByText("Ausgewählte Abbildungen Kap. 1").first().click()
      ]);
      expect(download).toBeTruthy();
      await download.cancel();
    });
  });

  test("External links page @externallinkspage", async ({
    eBooksSignInPage,
    libraryPage,
    page,
    context
  }) => {
    await test.step("Sign in", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.standard.username,
        users.standard.password
      );
      await expect(libraryPage.entitlementlist).toBeVisible();
    });

    await test.step("Open External links page", async () => {
      await libraryPage.entitlementItem.filter({ hasText: bookWithExternalLinks.title }).click();
      await libraryPage.modal.entitlementExternalLinksLink.click();
    });

    await test.step("Check the intermediate page title", async () => {
      await expect(
        page.getByRole("heading", {
          name: new RegExp(`(External links|${bookWithExternalLinks.title} - External links)`)
        })
      ).toBeVisible();
    });

    await test.step("Check that the external links list is displayed", async () => {
      await expect(page.locator(".content-menu")).toBeVisible();
    });

    await test.step("Open external link in a new tab", async () => {
      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        page.getByRole("link", { name: "Videos" }).first().click()
      ]);

      await test.step("Verify the new tab URL", async () => {
        await expect(newPage).toHaveURL(/coursewareobjects\.elsevier\.com/);
      });

      await newPage.close();
    });
  });
});
