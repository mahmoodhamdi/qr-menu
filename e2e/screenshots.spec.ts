import { test } from "@playwright/test";

test.describe("Screenshots", () => {
  test("capture landing page", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/01-landing-page.png", fullPage: true });
  });

  test("capture menu page", async ({ page }) => {
    await page.goto("/en/menu/demo-restaurant");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/02-menu-page.png", fullPage: true });
  });

  test("capture menu dark mode", async ({ page }) => {
    await page.goto("/en/menu/demo-restaurant");
    await page.waitForTimeout(2000);
    // Click the theme toggle button
    const themeButton = page.getByRole('button', { name: 'Toggle theme' });
    if (await themeButton.isVisible()) {
      await themeButton.click();
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/03-menu-dark-mode.png", fullPage: true });
  });

  test("capture menu arabic", async ({ page }) => {
    await page.goto("/ar/menu/demo-restaurant");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/04-menu-arabic.png", fullPage: true });
  });

  test("capture admin dashboard", async ({ page }) => {
    await page.goto("/en/admin");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/05-admin-dashboard.png", fullPage: true });
  });

  test("capture admin items page", async ({ page }) => {
    await page.goto("/en/admin/items");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/06-admin-items.png", fullPage: true });
  });

  test("capture admin add item dialog", async ({ page }) => {
    await page.goto("/en/admin/items");
    await page.waitForTimeout(2000);
    const addButton = page.locator('button').filter({ hasText: /add/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: "screenshots/07-admin-add-item.png", fullPage: true });
  });

  test("capture admin categories page", async ({ page }) => {
    await page.goto("/en/admin/categories");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/08-admin-categories.png", fullPage: true });
  });

  test("capture admin QR page", async ({ page }) => {
    await page.goto("/en/admin/qr");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/09-admin-qr.png", fullPage: true });
  });

  test("capture mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en/menu/demo-restaurant");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/10-mobile-menu.png", fullPage: true });
  });
});
