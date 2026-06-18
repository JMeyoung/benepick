import { Aggregator, AggregatedBenefit } from './types';

/**
 * 해피포인트(Happy Point) 혜택 Aggregator.
 *
 * 해피포인트는 SPC 그룹(파리바게뜨·배스킨라빈스·던킨·쉐이크쉑 등)과
 * GS25·Gmarket 등을 아우르는 한국 3대 연합 포인트 제도 중 하나다.
 * 가입 무료이며 제휴 브랜드에서 포인트를 통합 적립·사용할 수 있다.
 * 특히 생일 쿠폰·등급별 할인·정기 이벤트(배스킨 31일 할인 등)가 강점이다.
 *
 * 누구나 무료 가입 가능하므로 rules를 부여하지 않는다(전원 노출).
 */
export const happyPointAggregator: Aggregator = {
  name: "HAPPY_POINT",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[HAPPY_POINT] Building curated Happy Point membership benefits...");

    const note = " (공식 페이지에서 최신 혜택을 확인하세요 / 이벤트성 혜택은 기간 종료 후 변경될 수 있습니다)";

    const benefits: AggregatedBenefit[] = [
      {
        title: "파리바게뜨 해피포인트 — 스탬프 적립·등급 할인",
        summary: "파리바게뜨 구매마다 스탬프 적립, 등급별 생일 케이크 쿠폰",
        description:
          "파리바게뜨에서 결제 시 해피포인트가 적립되며, 등급(일반·실버·골드·VIP)에 따라 생일 케이크 할인 쿠폰·정기 할인 쿠폰 등 혜택이 달라진다. 적립 포인트는 배스킨라빈스·던킨·GS25 등 해피포인트 제휴 브랜드 전체에서 사용 가능하다." +
          note,
        category: "CAFE_FOOD",
        sourceUrl: "https://www.happypointcard.com/page/main/index.spc",
        organizationName: "파리바게뜨",
        organizationType: "BRAND",
      },
      {
        title: "배스킨라빈스 31일 할인 + 생일 무료 아이스크림",
        summary: "매월 31일 아이스크림 31% 할인, 해피포인트 회원 생일 무료 제공",
        description:
          "배스킨라빈스는 매월 31일(또는 31일이 없는 달은 마지막 날) 해피포인트 앱 제시 시 아이스크림 31% 할인을 제공한다. 해피포인트 가입 회원은 생일 당월에 아이스크림 무료 쿠폰을 받으며, 앱에서 미리 수령해 사용할 수 있다." +
          note,
        category: "CAFE_FOOD",
        sourceUrl: "https://www.baskinrobbins.co.kr/",
        organizationName: "배스킨라빈스",
        organizationType: "BRAND",
      },
      {
        title: "GS25 해피포인트 적립 및 멤버십 할인",
        summary: "GS25 결제 시 해피포인트 적립, 앱 쿠폰 할인 연계",
        description:
          "GS25에서 해피포인트 앱 바코드를 제시하면 포인트가 적립되며, 앱 쿠폰과 연동해 추가 할인 혜택을 받을 수 있다. 적립된 포인트는 파리바게뜨·배스킨라빈스 등 SPC 계열 브랜드와 Gmarket에서 사용 가능하다." +
          note,
        category: "LIFE",
        sourceUrl: "https://www.happypointcard.com/page/partners/index.spc",
        organizationName: "GS25",
        organizationType: "BRAND",
      },
      {
        title: "해피포인트 통합 등급 혜택 — 전 제휴 브랜드 등급 우대",
        summary: "SPC 계열 전 브랜드 통합 포인트 적립·사용, 등급별 추가 쿠폰",
        description:
          "해피포인트는 파리바게뜨·배스킨라빈스·던킨·쉐이크쉑·잠바주스·GS25·Gmarket 등 1만 개 이상 제휴 가맹점에서 통합 포인트를 적립·사용할 수 있다. 누적 포인트에 따라 등급이 올라가면 전용 쿠폰·사은품·우선 예약 혜택을 받는다." +
          note,
        category: "LIFE",
        sourceUrl: "https://www.happypointcard.com/page/main/index.spc",
        organizationName: "해피포인트",
        organizationType: "BRAND",
      },
    ];

    console.log(`[HAPPY_POINT] Curated ${benefits.length} benefits.`);
    return benefits;
  },
};
