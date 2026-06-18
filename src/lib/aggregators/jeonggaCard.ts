import { Aggregator, AggregatedBenefit } from './types';

/**
 * 정가거부(짠테크 유튜버) 채널 큐레이션 기반 가성비 카드 혜택 Aggregator.
 *
 * 정가거부 채널은 특정 기업과 이해관계 없이 "가격 조건이 좋은 상품"만 단계별로
 * 소개하는 것이 특징이다. 본 aggregator는 그 채널에서 반복적으로 추천되는
 * 무실적·고정생활비 절감형 카드를 정적 큐레이션으로 담는다.
 *
 * - sourceUrl 은 각 카드사 공식 안내 페이지(신뢰 확보 원칙).
 * - 각 카드 혜택에는 CARD_ISSUER 노출 조건을 부여해, 온보딩에서 해당 카드사를
 *   선택한 사용자에게만 노출되도록 한다(matchesBenefit 의 CARD_ISSUER 규칙).
 * - 혜택 조건은 시즌별 프로모션으로 변동될 수 있으므로 운영자 정기 갱신을 전제로 한다.
 */
export const jeonggaCardAggregator: Aggregator = {
  name: "JEONGGA_CARD",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[JEONGGA_CARD] Building curated card benefits (정가거부 reference)...");

    const note = " (정가거부 채널 큐레이션 기준 / 혜택은 시즌별 변동 가능하니 공식 페이지 확인)";

    const benefits: AggregatedBenefit[] = [
      {
        title: "토스뱅크 체크카드 — 7개 영역 매일 캐시백",
        summary: "편의점·대중교통 등 7개 영역 1만원↑ 결제 시 최대 500원 캐시백",
        description:
          "전월실적 조건 없이 편의점·대중교통·카페 등 7개 생활 영역에서 1만원 이상 결제 시 영역별 최대 500원을 매일 1회, 월 최대 10회까지 캐시백 받는다. 시즌별 프로모션으로 운영된다." +
          note,
        category: "LIFE",
        sourceUrl: "https://www.tossbank.com/card/benefits",
        organizationName: "토스뱅크",
        organizationType: "CARD",
        rules: [{ ruleType: "CARD_ISSUER", stringValue: "TOSS" }],
      },
      {
        title: "토스뱅크 K-패스 체크카드 — 대중교통 환급",
        summary: "대중교통 월 15회↑ 이용 시 20~53% 환급",
        description:
          "K-패스와 연계해 대중교통을 월 15회 이상 이용하면 이용금액의 20~53%를 환급받는다. 일반/청년/저소득층 구간별로 환급률이 다르다. 교통비 비중이 큰 사용자에게 유리하다." +
          note,
        category: "TRANSPORT",
        sourceUrl: "https://www.tossbank.com/articles/tossbank-kpass-checkcard",
        organizationName: "토스뱅크",
        organizationType: "CARD",
        rules: [{ ruleType: "CARD_ISSUER", stringValue: "TOSS" }],
      },
      {
        title: "카카오뱅크 프렌즈 체크카드 — 실적무관 캐시백",
        summary: "실적무관 평일 0.2%·주말 0.4% + 저가커피 3사 건당 100원",
        description:
          "전월실적 조건 없이 평일 0.2%, 주말 0.4% 캐시백을 제공한다. 추가로 컴포즈커피·메가MGC커피·빽다방에서 2천원 이상 결제 시 건당 100원, 후불교통 월 5만원↑ 4천원 등 프로모션 캐시백을 더해 월 최대 약 29,000원까지 받을 수 있다." +
          note,
        category: "CAFE_FOOD",
        sourceUrl: "https://www.kakaobank.com/products/checkcard",
        organizationName: "카카오뱅크",
        organizationType: "CARD",
        rules: [{ ruleType: "CARD_ISSUER", stringValue: "KAKAOBANK" }],
      },
      {
        title: "롯데카드 LOCA LIKIT 1.2 — 전 가맹점 1.2% 할인",
        summary: "전월실적·한도 없이 모든 결제 1.2%, 온라인 1.5% 할인",
        description:
          "전월실적과 할인 한도 조건 없이 국내외 모든 가맹점 결제 건에 1.2%, 온라인 결제 건에 1.5%를 할인해 준다. 할인 영역을 신경 쓰기 번거롭거나 온라인 결제가 많은 사용자에게 무난한 가성비 카드." +
          note,
        category: "SHOPPING",
        sourceUrl: "https://www.lottecard.co.kr",
        organizationName: "롯데카드",
        organizationType: "CARD",
        rules: [{ ruleType: "CARD_ISSUER", stringValue: "LOTTE" }],
      },
      {
        title: "신한카드 Mr.Life — 고정 생활비 할인",
        summary: "전월 50만원 시 통신·공과금 등 월 최대 약 3.4만원 할인",
        description:
          "전월실적 50만원을 넘기면 인터넷·통신비를 포함한 각종 공과금과 생활요금을 할인해 월 최대 약 3.4만원까지 혜택을 받는다. 고정 생활비 비중이 큰 가구에 적합하다." +
          note,
        category: "LIFE",
        sourceUrl: "https://www.shinhancard.com",
        organizationName: "신한카드",
        organizationType: "CARD",
        rules: [{ ruleType: "CARD_ISSUER", stringValue: "SHINHAN" }],
      },
      {
        title: "삼성 iD ON 카드 — 자동 맞춤 30% 할인",
        summary: "카페·배달앱·델리 등 가장 많이 쓴 영역 자동 30% 할인",
        description:
          "소비 패턴을 분석해 카페·배달앱·델리 등 가장 많이 쓴 영역을 찾아 자동으로 30% 맞춤 할인을 적용한다. 매번 할인 영역을 챙기기 번거로운 사용자에게 알아서 할인을 적용해 주는 맞춤 할인형 카드." +
          note,
        category: "CAFE_FOOD",
        sourceUrl: "https://www.samsungcard.com",
        organizationName: "삼성카드",
        organizationType: "CARD",
        rules: [{ ruleType: "CARD_ISSUER", stringValue: "SAMSUNG" }],
      },
      {
        title: "NH농협 올원 체크카드 — 생활밀착 캐시백",
        summary: "편의점·간편결제·통신 등 생활 영역 캐시백",
        description:
          "편의점·간편결제·통신요금 등 생활밀착 영역에서 캐시백/할인을 제공하는 무난한 가성비 체크카드. 전월실적 구간과 영역별 한도는 시즌별로 변동되니 공식 페이지에서 최신 조건을 확인한다." +
          note,
        category: "LIFE",
        sourceUrl: "https://card.nonghyup.com",
        organizationName: "NH농협카드",
        organizationType: "CARD",
        rules: [{ ruleType: "CARD_ISSUER", stringValue: "NH" }],
      },
    ];

    console.log(`[JEONGGA_CARD] Curated ${benefits.length} card benefits.`);
    return benefits;
  },
};
