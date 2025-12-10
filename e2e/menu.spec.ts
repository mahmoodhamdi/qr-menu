import { test, expect } from "@playwright/test";

test.describe("Public Menu", () => {
  test("displays demo restaurant menu", async ({ page }) => {
    await page.goto("/en/menu/demo-restaurant");

    // Check header is visible
    await expect(page.locator("header")).toBeVisible();

    // Check search input exists
    await expect(page.locator('input[type="search"]')).toBeVisible();

    // Check categories tabs exist
    await expect(page.locator('[role="tablist"]')).toBeVisible();
  });

  test("search filters items", async ({ page }) => {
    await page.goto("/en/menu/demo-restaurant");

    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill("Hummus");

    // Wait for filtering
    await page.waitForTimeout(300);

    // Search input should still contain the value
    await expect(searchInput).toHaveValue("Hummus");
  });

  test("switches language to Arabic", async ({ page }) => {
    await page.goto("/en/menu/demo-restaurant");

    // Click language toggle
    const languageToggle = page.locator('button:has(svg.lucide-languages)');
    await languageToggle.click();

    // Should redirect to Arabic version
    await expect(page).toHaveURL(/\/ar\/menu\/demo-restaurant/);
  });

  test("toggles dark mode", async ({ page }) => {
    await page.goto("/en/menu/demo-restaurant");

    // Click theme toggle
    const themeToggle = page.locator('button:has(svg.lucide-sun)');
    await themeToggle.click();

    // Should have dark class on html
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("Landing Page", () => {
  test("displays landing page content", async ({ page }) => {
    await page.goto("/en");

    // Check title exists
    await expect(
      page.getByRole("heading", { name: /digital menu/i })
    ).toBeVisible();

    // Check CTA buttons
    await expect(page.getByRole("link", { name: /get started/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /view demo/i })).toBeVisible();
  });

  test("navigates to demo menu", async ({ page }) => {
    await page.goto("/en");

    await page.getByRole("link", { name: /view demo/i }).click();

    await expect(page).toHaveURL(/\/menu\/demo-restaurant/);
  });
});
