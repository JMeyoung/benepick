import { Aggregator, AggregatedBenefit } from './types';

/**
 * 편의점·생활 행사 Aggregator — 정가거부 채널의 편의점 행사 정보 주제 기반.
 *
 * 정가거부 채널은 편의점 1+1/2+1 행사, 통신사 멤버십 결합 할인 등 생활밀착
 * 절약 정보를 다룬다. 본 aggregator는 그런 상시/주기 행사를 생활(LIFE)·
 * 카페·음식(CAFE_FOOD) 카테고리로 담는다. 누구나 이용 가능하므로 카드사 규칙은
 * 두지 않는다(전 사용자 노출).
 *
 * - sourceUrl 은 각 편의점 공식 행사/멤버십 페이지.
 * - 행사는 매월 갱신되므로 운영자 정기 갱신을 전제로 한다.
 */
export const convenienceDealsAggregator: Aggregator = {
  name: "CONVENIENCE_DEALS",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[CONVENIENCE_DEALS] Building curated convenience-store deals (정가거부 reference)...");

    const note = " (정가거부 채널 큐레이션 기준 / 행사는 매월 갱신되니 공식 페이지 확인)";

    const benefits: AggregatedBenefit[] = [
      {
        title: "GS25 — 매월 1+1·2+1 행사 상품",
        summary: "매월 갱신되는 1+1·2+1 증정 행사 상품 모음",
        description:
          "GS25는 매월 음료·과자·간편식 등에서 1+1, 2+1 증정 행사를 진행한다. 나만의냉장고 앱으로 증정분을 보관했다 나중에 받을 수 있어 실질 단가를 크게 낮출 수 있다." +
          note,
        category: "LIFE",
        sourceUrl: "http://gs25.gsretail.com/gscvs/ko/products/event-goods",
        organizationName: "GS25",
        organizationType: "BRAND",
      },
      {
        title: "CU — 매월 덤증정·할인 행사",
        summary: "매월 갱신되는 1+1·2+1 및 멤버십 할인",
        description:
          "CU는 매월 1+1, 2+1 덤증정 행사와 멤버십(포켓CU) 할인을 함께 운영한다. 행사 상품은 포켓CU 앱에서 미리 확인하고, 통신사 멤버십·제휴카드와 중복 할인 가능 여부를 챙기면 더 저렴하다." +
          note,
        category: "LIFE",
        sourceUrl: "https://cu.bgfretail.com/event/plus.do",
        organizationName: "CU",
        organizationType: "BRAND",
      },
      {
        title: "세븐일레븐 — 행사 상품 & 멤버십 적립",
        summary: "1+1·2+1 행사 + 세븐앱 적립/쿠폰",
        description:
          "세븐일레븐은 매월 1+1, 2+1 행사 상품과 세븐앱 적립·쿠폰을 제공한다. 앱 쿠폰과 행사 상품을 조합하면 생활용품·간편식 구매 단가를 추가로 낮출 수 있다." +
          note,
        category: "LIFE",
        sourceUrl: "https://www.7-eleven.co.kr/product/presentList.asp",
        organizationName: "세븐일레븐",
        organizationType: "BRAND",
      },
    ];

    console.log(`[CONVENIENCE_DEALS] Curated ${benefits.length} convenience-store deals.`);
    return benefits;
  },
};
