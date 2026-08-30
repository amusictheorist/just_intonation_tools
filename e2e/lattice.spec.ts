import test, { expect } from "@playwright/test";

test("uses the lattice visualizer", async ({ page }) => {
  await page.goto("/lattice");

  await expect(
    page.getByRole("heading", { name: "Ratio Lattice Visualizer" }),
  ).toBeVisible();

  await expect(
    page.getByLabel("Interactive ratio-lattice visualizer"),
  ).toBeVisible();

  const ratioInput = page.getByRole("textbox", {
    name: "Ratio",
    exact: true,
  });

  await ratioInput.fill("3/2");
  await page.getByRole("button", { name: "Add" }).click();

  await ratioInput.fill("11/8");
  await page.getByRole("button", { name: "Add" }).click();

  await page.getByRole("checkbox", { name: "Include" }).check();

  const placementButton = page.getByRole("button", {
    name: "Placement",
    exact: true,
  });

  await expect(placementButton).toBeVisible();
  await placementButton.click();

  await expect(page.getByLabel("Higher-prime radius")).toBeVisible();
});

test("recovers from invalid lattice input", async ({ page }) => {
  await page.goto("/lattice");

  const ratioInput = page.getByRole("textbox", {
    name: "Ratio",
    exact: true,
  });

  await ratioInput.fill("0");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByRole("alert")).toBeVisible();

  await ratioInput.fill("3/2");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByRole("alert")).not.toBeVisible();
});
