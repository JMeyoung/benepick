import { describe, it, expect } from "vitest";
import {
  matchesBenefit,
  filterAndRankBenefits,
  type BenefitForMatch,
  type VisitorCondition,
} from "./matching";

const BASE_BENEFIT: BenefitForMatch = {
  id: "b1",
  status: "PUBLISHED",
  category: "CAFE_FOOD",
  endsAt: null,
  isFeatured: false,
  sourceUpdatedAt: new Date("2026-06-01"),
  region: null,
  rules: [],
};

const BASE_VISITOR: VisitorCondition = {
  ageGroup: "TWENTIES",
  isStudent: false,
  telecom: "KT",
  cardIssuerIds: ["SHINHAN", "KB"],
  categories: ["CAFE_FOOD", "CULTURE"],
  region: "서울",
};

// ---- matchesBenefit ----

describe("matchesBenefit — 규칙 없음", () => {
  it("규칙이 없으면 항상 노출", () => {
    expect(matchesBenefit({ ...BASE_BENEFIT, rules: [] }, BASE_VISITOR)).toBe(true);
  });
});

describe("matchesBenefit — STUDENT_ONLY", () => {
  const studentBenefit: BenefitForMatch = {
    ...BASE_BENEFIT,
    rules: [{ ruleType: "STUDENT_ONLY" }],
  };
  it("학생이면 통과", () => {
    expect(matchesBenefit(studentBenefit, { ...BASE_VISITOR, isStudent: true })).toBe(true);
  });
  it("학생 아니면 차단", () => {
    expect(matchesBenefit(studentBenefit, { ...BASE_VISITOR, isStudent: false })).toBe(false);
  });
});

describe("matchesBenefit — TELECOM", () => {
  const ktBenefit: BenefitForMatch = {
    ...BASE_BENEFIT,
    rules: [{ ruleType: "TELECOM", stringValue: "KT" }],
  };
  it("통신사 일치하면 통과", () => {
    expect(matchesBenefit(ktBenefit, { ...BASE_VISITOR, telecom: "KT" })).toBe(true);
  });
  it("통신사 불일치하면 차단", () => {
    expect(matchesBenefit(ktBenefit, { ...BASE_VISITOR, telecom: "SKT" })).toBe(false);
  });
});

describe("matchesBenefit — CARD_ISSUER", () => {
  const shinhanBenefit: BenefitForMatch = {
    ...BASE_BENEFIT,
    rules: [{ ruleType: "CARD_ISSUER", stringValue: "SHINHAN" }],
  };
  it("보유 카드사 포함 시 통과", () => {
    expect(matchesBenefit(shinhanBenefit, { ...BASE_VISITOR, cardIssuerIds: ["SHINHAN"] })).toBe(true);
  });
  it("보유 카드사 미포함 시 차단", () => {
    expect(matchesBenefit(shinhanBenefit, { ...BASE_VISITOR, cardIssuerIds: ["SAMSUNG"] })).toBe(false);
  });
  it("카드 없을 때 차단", () => {
    expect(matchesBenefit(shinhanBenefit, { ...BASE_VISITOR, cardIssuerIds: [] })).toBe(false);
  });
});

describe("matchesBenefit — AGE_RANGE", () => {
  const youngBenefit: BenefitForMatch = {
    ...BASE_BENEFIT,
    rules: [{ ruleType: "AGE_RANGE", minAge: 19, maxAge: 34 }],
  };
  it("연령대 겹치면 통과 (TWENTIES: 20-29 ⊂ 19-34)", () => {
    expect(matchesBenefit(youngBenefit, { ...BASE_VISITOR, ageGroup: "TWENTIES" })).toBe(true);
  });
  it("연령대 겹치면 통과 (THIRTIES: 30-39 와 19-34 일부 겹침)", () => {
    expect(matchesBenefit(youngBenefit, { ...BASE_VISITOR, ageGroup: "THIRTIES" })).toBe(true);
  });
  it("연령대 완전 벗어나면 차단 (FIFTIES_PLUS: 50+)", () => {
    expect(matchesBenefit(youngBenefit, { ...BASE_VISITOR, ageGroup: "FIFTIES_PLUS" })).toBe(false);
  });
});

describe("matchesBenefit — 복합 조건 (AND)", () => {
  const ktStudentBenefit: BenefitForMatch = {
    ...BASE_BENEFIT,
    rules: [
      { ruleType: "TELECOM", stringValue: "KT" },
      { ruleType: "STUDENT_ONLY" },
    ],
  };
  it("두 조건 모두 충족 시 통과", () => {
    expect(matchesBenefit(ktStudentBenefit, { ...BASE_VISITOR, telecom: "KT", isStudent: true })).toBe(true);
  });
  it("통신사 불일치 시 차단", () => {
    expect(matchesBenefit(ktStudentBenefit, { ...BASE_VISITOR, telecom: "SKT", isStudent: true })).toBe(false);
  });
  it("학생 아닐 시 차단", () => {
    expect(matchesBenefit(ktStudentBenefit, { ...BASE_VISITOR, telecom: "KT", isStudent: false })).toBe(false);
  });
});

// ---- filterAndRankBenefits ----

describe("filterAndRankBenefits — 상태 필터", () => {
  const now = new Date("2026-06-11");
  it("DRAFT 혜택은 제외", () => {
    const b = { ...BASE_BENEFIT, status: "DRAFT" };
    expect(filterAndRankBenefits([b], BASE_VISITOR, now)).toHaveLength(0);
  });
  it("ARCHIVED 혜택은 제외", () => {
    const b = { ...BASE_BENEFIT, status: "ARCHIVED" };
    expect(filterAndRankBenefits([b], BASE_VISITOR, now)).toHaveLength(0);
  });
  it("PUBLISHED 혜택은 포함", () => {
    expect(filterAndRankBenefits([BASE_BENEFIT], BASE_VISITOR, now)).toHaveLength(1);
  });
});

describe("filterAndRankBenefits — 종료 혜택 비노출", () => {
  const now = new Date("2026-06-11");
  it("endsAt이 지난 혜택은 제외", () => {
    const b = { ...BASE_BENEFIT, endsAt: new Date("2026-05-31") };
    expect(filterAndRankBenefits([b], BASE_VISITOR, now)).toHaveLength(0);
  });
  it("endsAt이 오늘 이후면 포함", () => {
    const b = { ...BASE_BENEFIT, endsAt: new Date("2026-12-31") };
    expect(filterAndRankBenefits([b], BASE_VISITOR, now)).toHaveLength(1);
  });
  it("endsAt null이면 포함", () => {
    expect(filterAndRankBenefits([BASE_BENEFIT], BASE_VISITOR, now)).toHaveLength(1);
  });
});

describe("filterAndRankBenefits — 정렬", () => {
  const now = new Date("2026-06-11");
  it("isFeatured 혜택이 앞에 온다", () => {
    const normal = { ...BASE_BENEFIT, id: "b1" };
    const featured = { ...BASE_BENEFIT, id: "b2", isFeatured: true };
    const result = filterAndRankBenefits([normal, featured], BASE_VISITOR, now);
    expect(result[0].id).toBe("b2");
  });
  it("카테고리 일치 혜택이 불일치 혜택보다 앞에 온다", () => {
    const matched = { ...BASE_BENEFIT, id: "match", category: "CAFE_FOOD" };
    const unmatched = { ...BASE_BENEFIT, id: "nomatch", category: "FINANCE" };
    const result = filterAndRankBenefits([unmatched, matched], BASE_VISITOR, now);
    expect(result[0].id).toBe("match");
  });
});
