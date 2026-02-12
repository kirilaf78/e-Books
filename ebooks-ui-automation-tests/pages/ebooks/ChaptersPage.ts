import { expect, Locator, Page } from "@playwright/test";
import { ContentType } from "@constants/contentTypes";
import EbooksHeader from "@components/ui/EBooksHeader";

export default class ChaptersPage {
  readonly page: Page;
  readonly header: EbooksHeader;
  readonly heading: Locator;
  readonly chaptersList: Locator;
  readonly chaptersListItem: Locator;
  readonly allNotesLink: Locator;
  readonly backToTopButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new EbooksHeader(page);
    this.heading = page.getByRole("heading", { name: "Chapters", exact: true });

    //Chapters list
    this.chaptersList = page.locator(".list");
    this.chaptersListItem = page.locator(".list-item");
    this.backToTopButton = page.getByTestId("back-to-top");

    //Notes
    this.allNotesLink = page.getByTestId("all-notes");
  }

  async goto(vbid: string, actype: ContentType) {
    await this.page.goto(`${process.env.EBOOKS_BASEURL}${vbid}/${actype}/chapters`);
    await expect(this.heading).toBeVisible();
  }
}
