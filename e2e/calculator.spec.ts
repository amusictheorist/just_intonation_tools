import test, { expect } from "@playwright/test";

test("calculates a partial set", async ({ page }) => {
  await page.goto("/calculator");

  await expect(
    page.getByRole("heading", { name: "Set Calculator" }),
  ).toBeVisible();

  await page.getByLabel("Partial set").fill("12, 15, 18");

  await page.getByRole("button", { name: "Calculate" }).click();

  await expect(page.getByText("Set: {12, 15, 18}")).toBeVisible();

  await expect(page.getByText("Set class: [4, 5, 6]")).toBeVisible();

  await page.getByLabel("Transposition value").fill("3");

  await page.getByRole("button", { name: "Transpose" }).click();

  await expect(page.getByText("Partial set: {36, 45, 54}")).toBeVisible();

  await expect(page.getByText("Partial-class set: {9, 27, 45}")).toBeVisible();
});

test("recovers from invalid calculator input", async ({ page }) => {
  await page.goto("/calculator");

  await page.getByLabel("Partial set").fill("4.5, 5, 6");

  await page.getByRole("button", { name: "Calculate" }).click();

  await expect(
    page.getByText("Enter a valid set of positive integers."),
  ).toBeVisible();

  await page.getByLabel("Partial set").fill("4, 5, 6");

  await page.getByRole("button", { name: "Calculate" }).click();

  await expect(page.getByText("Set: {4, 5, 6}")).toBeVisible();

  await expect(
    page.getByText("Enter a valid set of positive integers."),
  ).not.toBeVisible();
});
