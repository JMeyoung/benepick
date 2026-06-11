// 규칙 기반 혜택 매칭 — 순수 함수, DB 미의존 (단위 테스트 가능)
// 기획안 §9 기준: 같은 ruleType끼리 OR, 다른 타입 간 AND

export type Rule = {
  ruleType: string;
  minAge?: number | null;
  maxAge?: number | null;
  stringValue?: string | null;
};

export type BenefitForMatch = {
  id: string;
  status: string;
  category: string;
  endsAt?: Date | null;
  isFeatured: boolean;
  sourceUpdatedAt: Date;
  region?: string | null;
  rules: Rule[];
};

export type VisitorCondition = {
  ageGroup: string; // AGE_GROUPS 코드
  isStudent: boolean;
  telecom: string; // TELECOMS 코드
  cardIssuerIds: string[]; // CARD_ISSUERS 코드 배열
  categories: string[]; // CATEGORIES 코드 배열
  region?: string | null;
};

import { AGE_GROUPS } from "./constants";

function ageRangeForGroup(ageGroup: string): { min: number; max: number } {
  const found = AGE_GROUPS.find((g) => g.code === ageGroup);
  return found ? { min: found.minAge, max: found.maxAge } : { min: 0, max: 120 };
}

/**
 * 단일 혜택이 방문자 조건을 충족하는지 판단.
 * 규칙 없음 → 전원 노출.
 * 규칙 있음 → 타입별로 그룹핑 후 같은 타입 OR, 타입 간 AND.
 */
export function matchesBenefit(benefit: BenefitForMatch, visitor: VisitorCondition): boolean {
  const { rules } = benefit;
  if (rules.length === 0) return true;

  // ruleType별 그룹핑
  const groups = new Map<string, Rule[]>();
  for (const r of rules) {
    const arr = groups.get(r.ruleType) ?? [];
    arr.push(r);
    groups.set(r.ruleType, arr);
  }

  const ageRange = ageRangeForGroup(visitor.ageGroup);

  for (const [ruleType, ruleGroup] of groups) {
    // 같은 타입 내 하나라도 통과하면 해당 타입 조건 충족 (OR)
    const groupPassed = ruleGroup.some((r) => {
      switch (ruleType) {
        case "STUDENT_ONLY":
          return visitor.isStudent;
        case "TELECOM":
          return r.stringValue === visitor.telecom;
        case "CARD_ISSUER":
          return visitor.cardIssuerIds.includes(r.stringValue ?? "");
        case "AGE_RANGE": {
          const min = r.minAge ?? 0;
          const max = r.maxAge ?? 120;
          // 방문자 연령대가 조건 범위와 겹치면 통과
          return ageRange.min <= max && ageRange.max >= min;
        }
        case "REGION":
          return r.stringValue === visitor.region;
        default:
          return false;
      }
    });
    // 하나의 타입이라도 AND 조건 실패 → 전체 실패
    if (!groupPassed) return false;
  }
  return true;
}

/**
 * 점수 계산 (정렬용)
 * +3: 관심 카테고리 일치
 * +2: 운영자 추천(isFeatured)
 * +1: 30일 내 갱신
 * +1: 지역 일치
 */
export function scoreBenefit(
  benefit: BenefitForMatch,
  visitor: VisitorCondition,
  now = new Date()
): number {
  let score = 0;
  if (visitor.categories.includes(benefit.category)) score += 3;
  if (benefit.isFeatured) score += 2;
  const daysSinceUpdate =
    (now.getTime() - new Date(benefit.sourceUpdatedAt).getTime()) / 86_400_000;
  if (daysSinceUpdate <= 30) score += 1;
  if (benefit.region && benefit.region === visitor.region) score += 1;
  return score;
}

/**
 * 전체 매칭 + 정렬 파이프라인.
 * - PUBLISHED만 통과
 * - 종료(endsAt 지남) 혜택 제외
 * - matchesBenefit 필터
 * - 점수 내림차순, 동점 시 갱신일 최신순
 */
export function filterAndRankBenefits(
  benefits: BenefitForMatch[],
  visitor: VisitorCondition,
  now = new Date()
): BenefitForMatch[] {
  const eligible = benefits.filter((b) => {
    if (b.status !== "PUBLISHED") return false;
    if (b.endsAt && new Date(b.endsAt) < now) return false;
    return matchesBenefit(b, visitor);
  });

  return eligible.sort((a, b) => {
    const diff = scoreBenefit(b, visitor, now) - scoreBenefit(a, visitor, now);
    if (diff !== 0) return diff;
    return new Date(b.sourceUpdatedAt).getTime() - new Date(a.sourceUpdatedAt).getTime();
  });
}
