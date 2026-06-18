// 혜택 노출 조건 — Benefit의 EligibilityRule로 저장된다.
// ruleType은 constants.ts의 RULE_TYPES 코드와 일치해야 한다.
export interface AggregatedRule {
  ruleType: string; // CARD_ISSUER | AGE_RANGE | TELECOM | STUDENT_ONLY | REGION
  minAge?: number | null; // AGE_RANGE 전용
  maxAge?: number | null; // AGE_RANGE 전용
  stringValue?: string | null; // CARD_ISSUER/TELECOM 코드, REGION 이름 등 (예: "TOSS")
}

export interface AggregatedBenefit {
  title: string;
  summary: string;
  description: string;
  category: string;
  sourceUrl: string;
  organizationName: string;
  organizationType: string;
  endsAt?: Date | null;
  region?: string | null;
  // 카드사·연령 등 노출 조건. 없으면(혹은 빈 배열) 전 사용자에게 노출된다.
  rules?: AggregatedRule[];
}

export interface Aggregator {
  /**
   * The name of the aggregator, e.g., "SKT_TMEMBERSHIP"
   */
  name: string;

  /**
   * Runs the data collection process.
   * Returns a list of standardized Benefit objects.
   */
  run: () => Promise<AggregatedBenefit[]>;
}
