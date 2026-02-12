import { users } from "@constants/users";
import { expect, test } from "@fixtures/pagesFixture";
import AutoUserOperations from "@helpers/AutoUserOperations";

test.describe("UI: eBooks+ Smoke Tests @ui @smoke @ebooks", () => {
  test("Sign In/Sign Out flow", async ({ eBooksSignInPage, libraryPage, context, page }) => {
    // Disable images loading to speed up tests
    await page.route("**/*.{png,jpg,jpeg,svg,gif}", async (route) => {
      await route.abort();
    });
    await test.step("Set cookies", async () => {
      await AutoUserOperations.setCookies(context);
    });

    await test.step("User goes to the base url", async () => {
      await page.goto(process.env.EBOOKS_BASEURL);
    });

    await test.step("Sign In Page opens", async () => {
      await expect(eBooksSignInPage.heading).toBeVisible();
    });

    await test.step("User accepts cookies and signs in", async () => {
      await eBooksSignInPage.acceptCookiesAndSignIn(
        users.ebooks_username_1,
        users.ebooks_password_1
      );
    });

    await test.step("Library page opens", async () => {
      await expect(libraryPage.heading).toBeVisible();
    });

    await test.step("Empty library message is displayed", async () => {
      await expect(libraryPage.emptyLibraryMessage).toBeVisible();
    });

    await test.step("User signs out", async () => {
      await libraryPage.header.signOut();
    });

    await test.step("Sign In page opens", async () => {
      await expect(eBooksSignInPage.heading).toBeVisible();
    });
  });
});
