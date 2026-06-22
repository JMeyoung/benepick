import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    // 단위 테스트만 수집한다. e2e/*.spec.ts 는 Playwright 전용이므로 제외해야
    // vitest 가 Playwright의 test.describe() 를 잘못 실행하지 않는다.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", "e2e/**", ".next/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
