// 도메인 전반에서 공유하는 코드/라벨 정의.
// DB에는 코드 문자열을 저장하고(SQLite enum 미지원), 화면에는 라벨을 보여준다.

export const CATEGORIES = [
  { code: "CAFE_FOOD", label: "카페·음식" },
  { code: "SHOPPING", label: "쇼핑" },
  { code: "CULTURE", label: "문화·여가" },
  { code: "EDUCATION", label: "교육" },
  { code: "TRANSPORT", label: "교통·이동" },
  { code: "TELECOM", label: "통신" },
  { code: "FINANCE", label: "금융" },
  { code: "BEAUTY_HEALTH", label: "뷰티·건강" },
  { code: "LIFE", label: "생활" },
] as const;
export type CategoryCode = (typeof CATEGORIES)[number]["code"];

export const TELECOMS = [
  { code: "SKT", label: "SKT" },
  { code: "KT", label: "KT" },
  { code: "LGU", label: "LG U+" },
  { code: "MVNO", label: "알뜰폰" },
  { code: "NONE", label: "해당 없음" },
] as const;
export type TelecomCode = (typeof TELECOMS)[number]["code"];

// 통신사 조건 규칙에 쓸 수 있는 값 (MVNO/NONE 전용 혜택은 없다고 본다)
export const TELECOM_RULE_VALUES = ["SKT", "KT", "LGU"] as const;

export const CARD_ISSUERS = [
  { code: "SHINHAN", label: "신한카드" },
  { code: "SAMSUNG", label: "삼성카드" },
  { code: "HYUNDAI", label: "현대카드" },
  { code: "KB", label: "KB국민카드" },
  { code: "LOTTE", label: "롯데카드" },
  { code: "WOORI", label: "우리카드" },
  { code: "HANA", label: "하나카드" },
  { code: "BC", label: "BC카드" },
] as const;
export type CardIssuerCode = (typeof CARD_ISSUERS)[number]["code"];

export const AGE_GROUPS = [
  { code: "TEENS", label: "10대", minAge: 13, maxAge: 19 },
  { code: "TWENTIES", label: "20대", minAge: 20, maxAge: 29 },
  { code: "THIRTIES", label: "30대", minAge: 30, maxAge: 39 },
  { code: "FORTIES", label: "40대", minAge: 40, maxAge: 49 },
  { code: "FIFTIES_PLUS", label: "50대 이상", minAge: 50, maxAge: 120 },
] as const;
export type AgeGroupCode = (typeof AGE_GROUPS)[number]["code"];

export const REGIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
] as const;
export type RegionName = (typeof REGIONS)[number];

export const BENEFIT_STATUSES = [
  { code: "DRAFT", label: "초안" },
  { code: "PUBLISHED", label: "게시 중" },
  { code: "ARCHIVED", label: "종료" },
] as const;
export type BenefitStatus = (typeof BENEFIT_STATUSES)[number]["code"];

export const RULE_TYPES = [
  { code: "AGE_RANGE", label: "연령 조건" },
  { code: "STUDENT_ONLY", label: "학생 전용" },
  { code: "TELECOM", label: "통신사 조건" },
  { code: "CARD_ISSUER", label: "카드사 조건" },
  { code: "REGION", label: "지역 조건" },
] as const;
export type RuleType = (typeof RULE_TYPES)[number]["code"];

export const ORG_TYPES = [
  { code: "CARD", label: "카드사" },
  { code: "TELECOM", label: "통신사" },
  { code: "STUDENT_PLATFORM", label: "학생 플랫폼" },
  { code: "BRAND", label: "브랜드" },
  { code: "GOVERNMENT", label: "공공기관" },
  { code: "OTHER", label: "기타" },
] as const;
export type OrgType = (typeof ORG_TYPES)[number]["code"];

export const LEAD_TYPES = [
  { code: "WAITLIST", label: "대기자 등록" },
  { code: "INTERVIEW", label: "인터뷰 신청" },
] as const;
export type LeadType = (typeof LEAD_TYPES)[number]["code"];

// ---- 라벨 헬퍼 ----

function toMap<T extends readonly { code: string; label: string }[]>(list: T) {
  return Object.fromEntries(list.map((i) => [i.code, i.label])) as Record<string, string>;
}

export const CATEGORY_LABELS = toMap(CATEGORIES);
export const TELECOM_LABELS = toMap(TELECOMS);
export const CARD_ISSUER_LABELS = toMap(CARD_ISSUERS);
export const AGE_GROUP_LABELS = toMap(AGE_GROUPS);
export const STATUS_LABELS = toMap(BENEFIT_STATUSES);
export const RULE_TYPE_LABELS = toMap(RULE_TYPES);
export const ORG_TYPE_LABELS = toMap(ORG_TYPES);
export const LEAD_TYPE_LABELS = toMap(LEAD_TYPES);

export function categoryLabel(code: string) {
  return CATEGORY_LABELS[code] ?? code;
}
export function telecomLabel(code: string) {
  return TELECOM_LABELS[code] ?? code;
}
export function cardIssuerLabel(code: string) {
  return CARD_ISSUER_LABELS[code] ?? code;
}
