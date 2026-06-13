import { test, expect } from "@playwright/test";

test.describe("대기자 등록 폼", () => {
  test("유효한 정보 제출 → 완료 메시지", async ({ page }) => {
    await page.goto("/waitlist");
    await expect(page.getByRole("heading", { name: /베타/ })).toBeVisible();

    // 신청 유형 (sr-only 라디오 → 부모 label 클릭)
    await page.locator('label:has(input[name="type"][value="WAITLIST"])').click();

    await page.locator("#name").fill("테스트유저");
    await page.locator("#contact").fill("test-e2e@example.com");

    // 개인정보 동의 체크박스
    await page.locator("#consent").click();

    await page.getByRole("button", { name: /신청|제출|등록/ }).click();

    await expect(page.getByText(/완료|감사|접수|신청되었/)).toBeVisible({ timeout: 8000 });
  });

  test("연락처 없이 제출 → 폼 미제출 상태 유지", async ({ page }) => {
    await page.goto("/waitlist");

    await page.locator('label:has(input[name="type"][value="WAITLIST"])').click();
    await page.locator("#name").fill("테스트유저");
    // contact 비움

    await page.getByRole("button", { name: /신청|제출|등록/ }).click();

    // 성공 시에만 보이는 이모지("🎉")가 없어야 함
    await expect(page.getByText("🎉")).not.toBeVisible({ timeout: 3000 });
  });
});
