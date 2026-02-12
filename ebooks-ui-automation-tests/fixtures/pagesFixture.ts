import { test as baseTest } from "@playwright/test";
import MyAccountPage from "@pages/common/MyAccountPage";
import AccessCodeHelpPage from "@pages/ebooks/AccessCodeHelpPage";
import {
  AudioContentPage,
  ImageContentPage,
  PdfContentPage,
  VideoContentPage
} from "@pages/ebooks/AdditionalContentPage";
import ChaptersPage from "@pages/ebooks/ChaptersPage";
import ChapterVideosPage from "@pages/ebooks/ChapterVideosPage";
import LibraryPage from "@pages/ebooks/LibraryPage";
import MigrationSettingsPage from "@pages/ebooks/MigrationSettingsPage";
import NotesPage from "@pages/ebooks/NotesPage";
import NotFoundPage from "@pages/ebooks/NotFoundPage";
import RedeemAdditionalContentPage from "@pages/ebooks/RedeemAdditionalContentPage";
import EBooksSignInPage from "@pages/ebooks/SignInPage";

type ElsevierPages = {
  browserLogger: () => void;
  eBooksSignInPage: EBooksSignInPage;
  libraryPage: LibraryPage;
  accessCodeHelpPage: AccessCodeHelpPage;
  redeemAdditionalContentPage: RedeemAdditionalContentPage;
  notesPage: NotesPage;
  myAccountPage: MyAccountPage;
  chaptersPage: ChaptersPage;
  chapterVideosPage: ChapterVideosPage;
  videoContentPage: VideoContentPage;
  audioContentPage: AudioContentPage;
  imageContentPage: ImageContentPage;
  pdfContentPage: PdfContentPage;
  migrationSettingsPage: MigrationSettingsPage;
  notFoundPage: NotFoundPage;
};

export const test = baseTest.extend<ElsevierPages>({
  browserLogger: [
    async ({ page }, use) => {
      // Get detailed browser info from user agent and browser context
      const browserInfo = await page.evaluate(() => {
        const userAgent = navigator.userAgent;

        // Detect browser name and version
        let name = "Unknown Browser";
        let version = "Unknown";
        let engine = "Unknown";
        let isHeadless = false;

        if (/Edg\/(\d+\.\d+\.\d+\.\d+)/.test(userAgent)) {
          name = "Microsoft Edge";
          version = RegExp.$1;
          engine = "Blink";
        } else if (/Edge\/(\d+\.\d+\.\d+\.\d+)/.test(userAgent)) {
          // Legacy Edge detection
          name = "Microsoft Edge (Legacy)";
          version = RegExp.$1;
          engine = "EdgeHTML";
        } else if (/Chrome\/(\d+\.\d+\.\d+\.\d+)/.test(userAgent)) {
          version = RegExp.$1;
          engine = "Blink";

          // Check for headless mode
          isHeadless = /HeadlessChrome/.test(userAgent);

          // Detect Chrome vs Chromium patterns
          if (isHeadless) {
            name = "Headless Chrome/Chromium";
          } else if (/Android/.test(userAgent)) {
            name = "Mobile Chrome";
          } else {
            // Check for Google Chrome specific patterns
            const versionParts = version.split(".");
            if (versionParts.length === 4 && versionParts[3] !== "0") {
              name = "Google Chrome";
            } else {
              name = "Chromium";
            }
          }
        } else if (/Firefox\/(\d+\.\d+)/.test(userAgent)) {
          name = "Firefox";
          version = RegExp.$1;
          engine = "Gecko";
        } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
          name = /iPhone|iPad/.test(userAgent) ? "Mobile Safari" : "Desktop Safari";
          const versionMatch = userAgent.match(/Version\/(\d+\.\d+)/);
          version = versionMatch ? versionMatch[1] : "Unknown";
          engine = "WebKit";
        }

        return {
          name,
          version,
          engine,
          isHeadless,
          userAgent: userAgent.substring(0, 120) + "..."
        };
      });

      let detectedBrowser = browserInfo.name;
      let actualVersion = browserInfo.version;

      // Get actual browser version from browser instance
      try {
        const browserContext = page.context();
        const browser = browserContext.browser();
        if (browser) {
          actualVersion = browser.version();
        }
      } catch {
        // Ignore errors and use version from user agent
      }

      // Set detected browser name based on user agent detection
      detectedBrowser = browserInfo.name;

      console.info(`Browser: ${detectedBrowser} ${actualVersion}`);
      // The following lines are commented out for potential future use
      //console.info(`Engine: ${playwrightEngine}`);
      //console.info(`Headless: ${browserInfo.isHeadless}`);
      //console.info(`UserAgent Version: ${browserInfo.version} | Actual Version: ${actualVersion}`);

      await use(undefined);
    },
    { auto: true }
  ],
  eBooksSignInPage: async ({ page }, use) => {
    const eBooksSignInPage = new EBooksSignInPage(page);
    await use(eBooksSignInPage);
  },
  libraryPage: async ({ page }, use) => {
    const libraryPage = new LibraryPage(page);
    await use(libraryPage);
  },
  accessCodeHelpPage: async ({ page }, use) => {
    const accessCodeHelpPage = new AccessCodeHelpPage(page);
    await use(accessCodeHelpPage);
  },
  redeemAdditionalContentPage: async ({ page }, use) => {
    const redeemAdditionalContentPage = new RedeemAdditionalContentPage(page);
    await use(redeemAdditionalContentPage);
  },
  myAccountPage: async ({ page }, use) => {
    const myAccountPage = new MyAccountPage(page);
    await use(myAccountPage);
  },
  notesPage: async ({ page }, use) => {
    const notesPage = new NotesPage(page);
    await use(notesPage);
  },
  chaptersPage: async ({ page }, use) => {
    const chaptersPage = new ChaptersPage(page);
    await use(chaptersPage);
  },
  chapterVideosPage: async ({ page }, use) => {
    const chapterVideosPage = new ChapterVideosPage(page);
    await use(chapterVideosPage);
  },
  videoContentPage: async ({ page }, use) => {
    const videoContentPage = new VideoContentPage(page);
    await use(videoContentPage);
  },
  audioContentPage: async ({ page }, use) => {
    const audioContentPage = new AudioContentPage(page);
    await use(audioContentPage);
  },
  imageContentPage: async ({ page }, use) => {
    const imageContentPage = new ImageContentPage(page);
    await use(imageContentPage);
  },
  pdfContentPage: async ({ page }, use) => {
    const pdfContentPage = new PdfContentPage(page);
    await use(pdfContentPage);
  },
  migrationSettingsPage: async ({ page }, use) => {
    const migrationSettingsPage = new MigrationSettingsPage(page);
    await use(migrationSettingsPage);
  },
  notFoundPage: async ({ page }, use) => {
    const notFoundPage = new NotFoundPage(page);
    await use(notFoundPage);
  }
});

export const expect = test.expect;
