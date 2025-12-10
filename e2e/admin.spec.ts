import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  test("displays dashboard with stats", async ({ page }) => {
    await page.goto("/en/admin");

    // Check dashboard title
    await expect(
      page.getByRole("heading", { name: /dashboard/i })
    ).toBeVisible();

    // Check stat cards are visible
    await expect(page.getByText(/total items/i)).toBeVisible();
    await expect(page.getByText(/total categories/i)).toBeVisible();
    await expect(page.getByText(/active items/i)).toBeVisible();
  });

  test("navigates to items page", async ({ page }) => {
    await page.goto("/en/admin");

    await page.getByRole("link", { name: /items/i }).click();

    await expect(page).toHaveURL(/\/admin\/items/);
  });

  test("navigates to categories page", async ({ page }) => {
    await page.goto("/en/admin");

    await page.getByRole("link", { name: /categories/i }).click();

    await expect(page).toHaveURL(/\/admin\/categories/);
  });

  test("navigates to QR page", async ({ page }) => {
    await page.goto("/en/admin");

    await page.getByRole("link", { name: /qr code/i }).click();

    await expect(page).toHaveURL(/\/admin\/qr/);
  });
});

test.describe("Admin Items", () => {
  test("displays items list", async ({ page }) => {
    await page.goto("/en/admin/items");

    // Check page title
    await expect(page.getByRole("heading", { name: /items/i })).toBeVisible();

    // Check add button exists
    await expect(page.getByRole("button", { name: /add item/i })).toBeVisible();
  });

  test("opens add item dialog", async ({ page }) => {
    await page.goto("/en/admin/items");

    await page.getByRole("button", { name: /add item/i }).click();

    // Check dialog is open
    await expect(page.getByRole("dialog")).toBeVisible();
    // Check for the exact Item Name field (not Arabic)
    await expect(page.getByRole("textbox", { name: "Item Name", exact: true })).toBeVisible();
    await expect(page.getByLabel("Price")).toBeVisible();
  });
});

test.describe("Admin Categories", () => {
  test("displays categories list", async ({ page }) => {
    await page.goto("/en/admin/categories");

    // Check page title
    await expect(
      page.getByRole("heading", { name: /categories/i })
    ).toBeVisible();

    // Check add button exists
    await expect(
      page.getByRole("button", { name: /add category/i })
    ).toBeVisible();
  });
});

test.describe("Admin QR", () => {
  test("displays QR generator", async ({ page }) => {
    await page.goto("/en/admin/qr");

    // Check page title
    await expect(
      page.getByRole("heading", { name: /qr code/i })
    ).toBeVisible();

    // Check download button exists
    await expect(
      page.getByRole("button", { name: /download/i })
    ).toBeVisible();
  });

  test("copies menu URL", async ({ page }) => {
    await page.goto("/en/admin/qr");

    // Find and click copy button
    const copyButton = page.locator('button:has(svg.lucide-copy)');
    await copyButton.click();

    // Button should show check icon after copy
    await expect(page.locator('button:has(svg.lucide-check)')).toBeVisible();
  });
});
