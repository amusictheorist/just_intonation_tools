import test, { expect } from "@playwright/test";

test("loads the application", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Just Intonation Tools/i);
});
