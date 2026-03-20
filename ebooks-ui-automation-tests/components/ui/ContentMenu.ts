import { Locator, Page } from "@playwright/test";

export default class ContentMenu {
  readonly page: Page;
  readonly body: Locator;
  readonly heading: Locator;
  readonly panel: Locator;
  readonly panelTitle: Locator;
  readonly panelItemsList: Locator;
  readonly panelItemLink: Locator;
  readonly allContentItemsList: Locator;
  readonly expandedPanel: Locator;
  readonly itemLink: Locator;
  readonly itemButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.body = page.locator("div#content-menu");
    this.heading = this.body.locator("h2");
    this.panel = this.body.getByTestId("toggle-panel");
    this.panelTitle = this.panel.getByRole("button");
    this.panelItemsList = this.panel.locator("ul");
    this.panelItemLink = this.panelItemsList.locator("li").locator("a");
    this.expandedPanel = this.body.locator("[aria-expanded='true']");
    this.allContentItemsList = this.body.getByTestId("content-menu-items").locator("ul");
    this.itemLink = this.allContentItemsList.locator("a");
    this.itemButton = this.allContentItemsList.locator("button");
  }
}
