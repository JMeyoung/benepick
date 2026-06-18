import { Aggregator, AggregatedBenefit } from './types';

/**
 * 네이버플러스 멤버십 혜택 Aggregator.
 *
 * 네이버플러스는 월 4,900원(연간 기준 3,900원/월) 구독 시 네이버 생태계
 * 전반에 걸친 쇼핑 적립·스트리밍·편의점 할인 혜택을 제공하는 대형 구독 멤버십이다.
 * 2026년 기준 가입자 수가 3,000만 명을 넘는 국내 최대 규모 멤버십 중 하나다.
 *
 * 카드사·통신사 조건 없이 누구나 가입 가능하므로 rules를 부여하지 않는다(전원 노출).
 * sourceUrl은 네이버페이 공식 멤버십 안내 페이지.
 */
export const naverPlusAggregator: Aggregator = {
  name: "NAVER_PLUS",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[NAVER_PLUS] Building curated Naver Plus membership benefits...");

    const note = " (공식 페이지에서 최신 혜택을 확인하세요 / 혜택은 정책 변경에 따라 달라질 수 있습니다)";

    const benefits: AggregatedBenefit[] = [
      {
        title: "네이버 쇼핑·여행·예약 최대 5% 포인트 적립",
        summary: "네이버페이로 결제 시 일반 회원(1%) 대비 최대 5% 포인트 적립",
        description:
          "네이버플러스 멤버십 가입 시 네이버 쇼핑·예약·여행 결제에서 최대 5% 네이버페이 포인트가 적립된다. 비회원 기본 적립률(1%)보다 최대 5배 높아 온라인 쇼핑 비중이 큰 사용자에게 실질 혜택이 크다. 적립 포인트는 쇼핑·음악·웹툰 등 네이버 서비스 전반에 사용 가능하다." +
          note,
        category: "SHOPPING",
        sourceUrl: "https://m.pay.naver.com/membership/info",
        organizationName: "네이버플러스",
        organizationType: "BRAND",
      },
      {
        title: "CU 편의점 5% 할인 + 5% 포인트 동시 적립",
        summary: "CU 결제 시 네이버플러스 전용 5% 할인 및 포인트 적립",
        description:
          "네이버플러스 회원은 CU 편의점에서 결제 시 5% 즉시 할인과 함께 5% 네이버페이 포인트를 동시에 적립받는다. 편의점 방문 빈도가 높은 사용자라면 멤버십 구독료를 편의점 혜택만으로 빠르게 회수할 수 있다." +
          note,
        category: "LIFE",
        sourceUrl: "https://m.pay.naver.com/membership/info",
        organizationName: "네이버플러스",
        organizationType: "BRAND",
      },
      {
        title: "GS25 POP 상품 10% 할인",
        summary: "GS25 POP(인기 추천) 상품 구매 시 10% 할인",
        description:
          "네이버플러스 회원은 GS25에서 매월 선정되는 POP(인기 상품군)에서 10% 할인 혜택을 받는다. 과자·음료·간편식 등 자주 구매하는 카테고리가 포함된다." +
          note,
        category: "LIFE",
        sourceUrl: "https://m.pay.naver.com/membership/info",
        organizationName: "네이버플러스",
        organizationType: "BRAND",
      },
      {
        title: "월 1회 디지털 콘텐츠 선택권(넷플릭스·웹툰·Xbox 등)",
        summary: "매월 넷플릭스·네이버 웹툰·시리즈·Xbox Game Pass 중 1개 무료",
        description:
          "네이버플러스 멤버십은 매월 넷플릭스 광고형 구독권, 네이버 웹툰 쿠키, 네이버 시리즈 쿠키, Xbox PC Game Pass 중 원하는 혜택 1가지를 선택해 무료로 이용할 수 있다. 매월 선택을 바꿀 수 있어 보고 싶은 콘텐츠에 맞춰 유연하게 활용 가능하다." +
          note,
        category: "CULTURE",
        sourceUrl: "https://m.pay.naver.com/membership/info",
        organizationName: "네이버플러스",
        organizationType: "BRAND",
      },
    ];

    console.log(`[NAVER_PLUS] Curated ${benefits.length} benefits.`);
    return benefits;
  },
};
