import { Locator, Page } from "@playwright/test";
import EbooksHeader from "@components/ui/EBooksHeader";
import ErrorPage from "@components/ui/ErrorPage";

export default class ChapterVideosPage {
  readonly page: Page;
  readonly header: EbooksHeader;
  readonly heading: Locator;
  readonly chapterVideosList: Locator;
  readonly chapterVideosListItem: Locator;
  readonly errorPage: ErrorPage;

  constructor(page: Page) {
    this.page = page;
    this.header = new EbooksHeader(page);
    this.heading = page.getByRole("heading", { name: "Videos" });
    this.errorPage = new ErrorPage(page);

    //Chapter Videos list
    this.chapterVideosList = page.locator(".chapters-list");
    this.chapterVideosListItem = page.getByTestId("chapter-item");
  }
}
