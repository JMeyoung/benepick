import { test, expect } from "@playwright/test";

test.describe("랜딩 페이지", () => {
  test("h1과 CTA 버튼이 보인다", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("혜택만 한 번에");
    const cta = page.getByRole("link", { name: /조건|시작|혜택/ }).first();
    await expect(cta).toBeVisible();
  });

  test("CTA 클릭 시 /onboarding 으로 이동", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /조건|시작|혜택/ }).first();
    await cta.click();
    await expect(page).toHaveURL(/\/onboarding/);
  });
});
