import { test, expect } from "@playwright/test";

// sr-only 라디오는 부모 label을 클릭해야 체크됨
async function clickRadio(page: import("@playwright/test").Page, name: string, value: string) {
  await page.locator(`label:has(input[name="${name}"][value="${value}"])`).click();
}

async function clickShadcnCheckbox(page: import("@playwright/test").Page, id: string) {
  // shadcn Checkbox renders as <button role="checkbox" id="...">
  // clicking its associated <label htmlFor="..."> toggles it
  await page.locator(`label[for="${id}"]`).click();
}

test.describe("온보딩 플로우", () => {
  test("조건 입력 후 /benefits 로 이동", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.getByRole("heading", { name: "내 조건 입력" })).toBeVisible();

    await clickRadio(page, "ageGroup", "TWENTIES");
    await clickRadio(page, "isStudent", "true");
    await clickRadio(page, "telecom", "SKT");
    await clickShadcnCheckbox(page, "cat-CAFE_FOOD");

    await page.getByRole("button", { name: /혜택|확인|다음|저장/ }).click();

    await expect(page).toHaveURL(/\/benefits/, { timeout: 8000 });
  });

  test("카테고리 미선택 시 에러 메시지 표시", async ({ page }) => {
    await page.goto("/onboarding");

    await clickRadio(page, "ageGroup", "TWENTIES");
    await clickRadio(page, "isStudent", "false");
    await clickRadio(page, "telecom", "KT");
    // 카테고리 선택 안 함

    await page.getByRole("button", { name: /혜택|확인|다음|저장/ }).click();

    await expect(page.getByText(/최소 1개/)).toBeVisible({ timeout: 5000 });
    await expect(page).not.toHaveURL(/\/benefits/);
  });
});
