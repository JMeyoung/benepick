#!/usr/bin/env node
/**
 * skt_benefits.json → Benepick API 업로드 스크립트
 *
 * 사용법:
 *   node upload.mjs
 *   node upload.mjs --host https://your.vercel.app
 *   node upload.mjs --dry-run
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- 설정 ----
const ORGANIZATION_NAME = "SKT";
const SKT_RULE = { ruleType: "TELECOM", stringValue: "SKT" };
const REQUIRED = ["title", "summary", "description", "category", "sourceUrl", "sourceUpdatedAt"];

// ---- 인자 파싱 ----
const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const has = (flag) => args.includes(flag);

const jsonPath = get("--json") ?? join(__dirname, "skt_benefits.json");
const host = get("--host") ?? "http://localhost:3000";
const dryRun = has("--dry-run");
let apiKey = get("--api-key");

// .env에서 ADMIN_API_KEY 읽기
if (!apiKey) {
  const envPath = join(__dirname, ".env");
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, "utf-8");
    const match = envContent.match(/^ADMIN_API_KEY="?([^"\n]+)"?/m);
    if (match) apiKey = match[1];
  }
}
if (!apiKey) apiKey = process.env.ADMIN_API_KEY;
if (!apiKey) {
  console.error("ADMIN_API_KEY를 찾을 수 없습니다.");
  process.exit(1);
}

// ---- JSON 로드 ----
if (!existsSync(jsonPath)) {
  console.error(`파일 없음: ${jsonPath}`);
  process.exit(1);
}
const benefits = JSON.parse(readFileSync(jsonPath, "utf-8"));
if (!Array.isArray(benefits)) {
  console.error("JSON 최상위가 배열이어야 합니다.");
  process.exit(1);
}

// ---- 검증 ----
const errors = [];
benefits.forEach((b, i) => {
  const missing = REQUIRED.filter((k) => !b[k]);
  if (missing.length) errors.push(`[${i}] "${b.title ?? "?"}" — 누락: ${missing.join(", ")}`);
});
if (errors.length) {
  errors.forEach((e) => console.error(e));
  process.exit(1);
}

// SKT rule 자동 부착
const enriched = benefits.map((b) => ({
  ...b,
  rules: b.rules?.length ? b.rules : [SKT_RULE],
}));

console.log(`JSON 로드: ${jsonPath}`);
console.log(`검증 통과: ${enriched.length}건`);
console.log(`${dryRun ? "[DRY-RUN] " : ""}업로드 → ${host}/api/admin/import`);

if (dryRun) {
  console.log("--dry-run 모드. 실제 전송 없이 종료합니다.");
  process.exit(0);
}

// ---- 업로드 ----
const url = host.replace(/\/$/, "") + "/api/admin/import";
const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({ organizationName: ORGANIZATION_NAME, benefits: enriched }),
});

if (res.status === 401) { console.error("인증 실패. ADMIN_API_KEY 확인"); process.exit(1); }
if (res.status === 404) { console.error(`Organization '${ORGANIZATION_NAME}' DB에 없음. seed 먼저 실행`); process.exit(1); }
if (!res.ok) { console.error(`서버 오류 ${res.status}: ${await res.text()}`); process.exit(1); }

const data = await res.json();
console.log(`\n완료!`);
console.log(`  신규 생성: ${data.created}건`);
console.log(`  업데이트:  ${data.updated}건`);
console.log(`  전체 처리: ${data.total}건`);
