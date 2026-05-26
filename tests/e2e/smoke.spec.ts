import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
  test("Persian homepage loads with title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await expect(page).toHaveTitle(/قهوه آزادی/);
  });

  test("English homepage loads with title", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await expect(page).toHaveTitle(/Azadi Coffee/);
  });

  test("page stack tabs are visible", async ({ page }) => {
    await page.goto("/");
    const tabs = page.locator("button.landing-tab");
    await expect(tabs.first()).toBeVisible();
  });
});

test.describe("shop", () => {
  test("shop page shows products", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.locator("text=همه قهوه ها")).toBeVisible();
    const cards = page.locator("a[href^='/shop/']");
    await expect(cards.first()).toBeVisible();
  });

  test("product detail page loads", async ({ page }) => {
    await page.goto("/shop/kurdistan-filter");
    await expect(page.locator("h1")).toContainText("آزادی کردستان");
  });

  test("category filter works", async ({ page }) => {
    await page.goto("/shop?category=espresso");
    await expect(page.getByRole("link", { name: "اسپرسو" })).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("language switch works", async ({ page }) => {
    await page.goto("/");
    await page.click("a[aria-label='Switch to English']");
    await expect(page).toHaveURL(/\/en/);
  });

  test("404 page renders", async ({ page }) => {
    await page.goto("/nonexistent");
    await expect(page.locator("text=404")).toBeVisible();
  });
});
