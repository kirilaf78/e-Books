import { Locator, Page } from "@playwright/test";
import ContentMenu from "@components/ui/ContentMenu";
import EbooksHeader from "@components/ui/EBooksHeader";

class ContentPage {
  readonly page: Page;
  readonly header: EbooksHeader;
  readonly contentMenu: ContentMenu;
  readonly mediaContainerBuffered: Locator;
  readonly mediaContainerPaused: Locator;
  readonly mediaContainerPlaying: Locator;
  readonly mediaContainerError: Locator;
  readonly drawerButton: Locator; // Mobile only
  readonly contentItemErrorFrame: Locator;
  readonly contentItemErrorTitle: Locator;
  readonly mediaListErrorFrame: Locator;
  readonly mediaListRetryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new EbooksHeader(page);
    this.contentMenu = new ContentMenu(page);
    this.drawerButton = page.getByTestId("layout-with-menu").getByRole("button");
    this.mediaContainerBuffered = page.locator("//div[@data-media-buffered='true']");
    this.mediaContainerPaused = page.locator("//div[@data-autotest-state='paused']");
    this.mediaContainerPlaying = page.locator("//div[@data-autotest-state='playing']");
    this.mediaContainerError = page.locator("//div[@data-autotest-state='error']");
    this.contentItemErrorFrame = page.getByTestId("content-item-error");
    this.contentItemErrorTitle = this.contentItemErrorFrame.locator("h2");
    this.mediaListErrorFrame = page.getByTestId("media-list-error");
    this.mediaListRetryButton = this.mediaListErrorFrame.getByTestId("retry-btn");
  }
}

export class VideoContentPage extends ContentPage {
  readonly videoContainer: Locator;
  readonly video: Locator;
  readonly videoTitle: Locator;
  readonly videoSource: Locator;

  constructor(page: Page) {
    super(page);
    this.videoContainer = page.getByTestId("video-container");
    this.video = page.locator("video");
    this.videoTitle = page.locator(".video-title");
    this.videoSource = page.locator(".video-source");
  }
}

export class AudioContentPage extends ContentPage {
  readonly audioContainer: Locator;
  readonly audio: Locator;
  readonly audioTitle: Locator;
  readonly audioSource: Locator;

  constructor(page: Page) {
    super(page);
    this.audioContainer = page.getByTestId("audio-container");
    this.audio = page.locator("audio");
    this.audioTitle = page.locator(".audio-title");
    this.audioSource = page.locator(".audio-source");
  }
}

export class ImageContentPage extends ContentPage {
  readonly imageContainer: Locator;
  readonly image: Locator;
  readonly imageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.imageContainer = this.page.getByTestId("image-container");
    this.image = this.imageContainer.locator("img");
    this.imageTitle = this.page.locator(".image-title");
  }
}

export class PdfContentPage extends ContentPage {
  readonly pdfPlaceholder: Locator;
  readonly pdfTitle: Locator;
  readonly pdfMobileViewTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pdfPlaceholder = page.getByTestId("single-pdf");
    this.pdfTitle = this.pdfPlaceholder.locator("h1");
    this.pdfMobileViewTitle = page.getByTestId("mobile-header");
  }
}

export class DocumentsContentPage extends ContentPage {
  /** Locator for each downloadable document button in the sidebar list */
  readonly documentItems: Locator;

  constructor(page: Page) {
    super(page);
    this.documentItems = this.page
      .getByRole("navigation", { name: "All Documents" })
      .getByRole("button");
  }

  /** Returns a locator for the main central heading with format "BookTitle - Documents" */
  mainHeading(bookTitle: string): Locator {
    return this.page.getByRole("heading", { name: `${bookTitle} - Documents` });
  }
}

export class ExternalLinksContentPage extends ContentPage {
  /** Locator for each external link item in the sidebar chapter panel */
  readonly externalLinkItems: Locator;

  constructor(page: Page) {
    super(page);
    this.externalLinkItems = this.page
      .getByRole("navigation", { name: "Chapters" })
      .getByRole("list")
      .getByRole("link");
  }

  /** Returns a locator for the intermediate page title / heading */
  pageTitle(bookTitle: string): Locator {
    return this.page.getByRole("heading", {
      name: new RegExp(`(External links|${bookTitle} - External links)`)
    });
  }
}
