import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@benepick.local";
const ADMIN_PASSWORD = "benepick2026!";

test.describe("관리자 로그인", () => {
  test("올바른 계정으로 로그인 → 관리자 대시보드", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "베네픽 관리자" })).toBeVisible();

    await page.locator("#email").fill(ADMIN_EMAIL);
    await page.locator("#password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /로그인/ }).click();

    await expect(page).toHaveURL(/\/admin(?!\/login)/, { timeout: 8000 });
  });

  test("잘못된 비밀번호 → 에러 메시지", async ({ page }) => {
    await page.goto("/admin/login");

    await page.locator("#email").fill(ADMIN_EMAIL);
    await page.locator("#password").fill("wrong-password");
    await page.getByRole("button", { name: /로그인/ }).click();

    await expect(
      page.getByText("이메일 또는 비밀번호가 올바르지 않습니다.")
    ).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("인증 없이 /admin 접근 → /admin/login 리다이렉트", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 });
  });
});
