import { users } from "@constants/users";
import { expect, test } from "@fixtures/pagesFixture";
import AutoUserOperations from "@helpers/AutoUserOperations";

const eBooksLink = process.env.EBOOKS_BASEURL.slice(0, -1);

test.describe("My Account Page @ui @ebooks @nrt @myaccount", () => {
  test.beforeEach(async ({ context }) => {
    await test.step("Set auto user cookie", async () => {
      // To prevent Pendo banners display https://elsevier.atlassian.net/browse/ESPMPS-2759
      await AutoUserOperations.setCookies(context);
    });
  });

  test("My Account Page", async ({ eBooksSignInPage, libraryPage, myAccountPage, page }) => {
    await test.step("Open eBooks+ base URL", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
      await expect(eBooksSignInPage.heading).toBeVisible();
    });

    await test.step("User accepts cookies and logs in", async () => {
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.standard.username,
        users.standard.password
      );
    });

    await test.step("Check the redirection to MyAccount page", async () => {
      await libraryPage.header.userInfoButton.click();
      myAccountPage = await libraryPage.header.openMyAccountLink();
      await expect.soft(myAccountPage.page).toHaveURL(process.env.MY_ACCOUNT_BASEURL);
      await expect(myAccountPage.heading).toBeVisible();
    });

    await test.step("Check the href attribute of eBooks text link", async () => {
      await expect.soft(myAccountPage.eBooksTextLink).toHaveAttribute("href", eBooksLink);
    });

    await test.step("Check the href attribute of eBooks image link", async () => {
      await expect.soft(myAccountPage.eBooksImgLink).toHaveAttribute("href", eBooksLink);
    });
  });
});
