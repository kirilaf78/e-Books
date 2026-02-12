import { Locator, Page } from "@playwright/test";
import Checkbox from "@components/ui/Checkbox";
import EbooksHeader from "@components/ui/EBooksHeader";

export default class NotesPage {
  readonly page: Page;
  readonly header: EbooksHeader;
  readonly checkbox: Checkbox;
  readonly heading: Locator;
  readonly notesList: Locator;
  readonly chapterTitle: Locator;
  readonly noteItem: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchBackButton: Locator;
  readonly allChaptersCheckbox: Locator;
  readonly allChaptersCheckboxChecked: Locator;
  readonly allChaptersCheckboxUnchecked: Locator;
  readonly allChaptersCheckboxLabel: Locator;
  readonly searchHighlight: Locator;
  readonly noResultsSection: Locator;
  readonly backToTopButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new EbooksHeader(page);
    this.checkbox = new Checkbox(page);
    this.heading = page.getByRole("heading");
    this.notesList = page.locator(".notes-list");
    this.chapterTitle = this.notesList.locator(".chapter-title");
    this.noteItem = page.getByTestId("note-item");
    this.searchInput = page.getByTestId("search-input");
    this.searchButton = page.getByTestId("search-notes-form").locator("//button[@type='submit']");
    this.searchBackButton = page
      .getByTestId("search-notes-form")
      .locator("//button[@type='button']");
    this.allChaptersCheckbox = this.checkbox.container.filter({ hasText: "All Chapters" });
    this.allChaptersCheckboxChecked = this.allChaptersCheckbox.locator(this.checkbox.checked);
    this.allChaptersCheckboxUnchecked = this.allChaptersCheckbox.locator(this.checkbox.unchecked);
    this.allChaptersCheckboxLabel = this.allChaptersCheckbox.locator(this.checkbox.label);
    this.searchHighlight = page.locator("//mark[@class='search-highlight ']");
    this.noResultsSection = page.getByTestId("notes-empty-state");
    this.backToTopButton = page.getByTestId("back-to-top");
  }
}
