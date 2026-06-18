import { Aggregator, AggregatedBenefit } from './types';

/**
 * CJ ONE 통합 멤버십 혜택 Aggregator.
 *
 * CJ ONE은 CGV·올리브영·뚜레쥬르·빕스 등 CJ 그룹 계열 브랜드의 포인트를
 * 통합 관리하는 멤버십 플랫폼이다. 가입 무료이며 등급(실버·골드·VIP)에 따라
 * 각 브랜드에서 포인트 적립률과 할인 혜택이 올라간다.
 * 한국 3대 포인트 제도(OK캐쉬백·해피포인트·CJ ONE) 중 하나로, 문화·뷰티·식음료를
 * 아우르는 넓은 혜택 생태계를 갖추고 있다.
 *
 * 무료 가입으로 누구나 이용 가능하므로 rules를 부여하지 않는다(전원 노출).
 */
export const cjOneAggregator: Aggregator = {
  name: "CJ_ONE",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[CJ_ONE] Building curated CJ ONE membership benefits...");

    const note = " (공식 페이지에서 등급별 최신 혜택을 확인하세요 / 혜택은 시즌·등급별로 변동됩니다)";

    const benefits: AggregatedBenefit[] = [
      {
        title: "CGV 씨네클럽 — CJ ONE 포인트로 영화 예매 할인",
        summary: "CGV 예매 시 CJ ONE 포인트 사용·적립, 씨네클럽 등급 혜택",
        description:
          "CJ ONE 회원은 CGV에서 영화 예매 시 CJ ONE 포인트를 사용하거나 적립할 수 있다. 씨네클럽 등급(일반·프리미어·엘리트)에 따라 영화 예매 할인 및 특별관 혜택이 달라지며, 엘리트 등급은 매월 영화 무료 예매 쿠폰을 받는다." +
          note,
        category: "CULTURE",
        sourceUrl: "https://www.cjone.com/benefits/cgv",
        organizationName: "CGV",
        organizationType: "BRAND",
      },
      {
        title: "올리브영 — CJ ONE 등급별 전용 쿠폰·올영세일 추가 할인",
        summary: "올리브영 쇼핑 시 CJ ONE VIP 등급 전용 추가 쿠폰, 연 4회 최대 70% 세일",
        description:
          "올리브영은 CJ ONE 멤버십과 연동되어 등급이 높을수록 오프라인·온라인 전용 할인 쿠폰과 사은품 혜택이 강화된다. 연 4회 '올영세일' 기간에는 최대 70%까지 할인을 제공하며, 매월 25~27일 '올영데이'에도 추가 혜택을 받을 수 있다." +
          note,
        category: "BEAUTY_HEALTH",
        sourceUrl: "https://www.oliveyoung.co.kr/store/main/getBypMain.do",
        organizationName: "올리브영",
        organizationType: "BRAND",
      },
      {
        title: "뚜레쥬르 — CJ ONE 포인트 적립·등급 할인",
        summary: "뚜레쥬르 구매 시 CJ ONE 포인트 적립, 등급별 할인 쿠폰",
        description:
          "뚜레쥬르에서 결제 시 CJ ONE 포인트가 적립되며, 등급(골드·VIP)에 따라 정기 할인 쿠폰과 생일 케이크 할인 혜택을 받는다. 적립 포인트는 CGV·올리브영 등 CJ ONE 제휴 브랜드 전체에서 사용 가능하다." +
          note,
        category: "CAFE_FOOD",
        sourceUrl: "https://www.tlj.co.kr/",
        organizationName: "뚜레쥬르",
        organizationType: "BRAND",
      },
      {
        title: "CJ ONE 통합 등급 혜택 — VIP·골드 포인트 2배 적립",
        summary: "CJ ONE 등급 달성 시 전 제휴 브랜드에서 포인트 최대 2배 적립",
        description:
          "CJ ONE 포인트를 일정 금액 이상 적립하면 골드·VIP 등급으로 올라가며, 제휴 전 브랜드(CGV·올리브영·뚜레쥬르·빕스 등)에서 포인트 적립률이 최대 2배까지 오른다. 등급 유지 기간은 연 단위로 갱신된다." +
          note,
        category: "LIFE",
        sourceUrl: "https://www.cjone.com/membership",
        organizationName: "CJ ONE",
        organizationType: "BRAND",
      },
    ];

    console.log(`[CJ_ONE] Curated ${benefits.length} benefits.`);
    return benefits;
  },
};
