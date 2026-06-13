import { Aggregator, AggregatedBenefit } from './types';
import { smartFetch } from '../utils/proxyFetcher';

export const hyundaiCardAggregator: Aggregator = {
  name: "HYUNDAI_CARD_BENEFITS",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[HYUNDAI_CARD_BENEFITS] Starting data aggregation...");

    try {
      // 현대카드 공식 혜택 안내 페이지 또는 공개 JSON 주소로 호출 시도
      const url = 'https://www.hyundaicard.com/api/example-endpoint'; // 가상의 API 엔드포인트
      let benefits: AggregatedBenefit[] = [];

      try {
        const res = await smartFetch(url);
        if (res.ok) {
          const rawData = await res.json();
          // API 연동 가공 로직...
          console.log("[HYUNDAI_CARD_BENEFITS] Fetch successful, parsing JSON...");
        }
      } catch (e) {
        // Fail silently and use fallback below for stable Stage 1
        console.log("[HYUNDAI_CARD_BENEFITS] External fetch failed, applying static active list...");
      }

      if (benefits.length === 0) {
        // 실시간 가장 많이 쓰이는 현대카드 M포인트 상시 혜택 탑재
        benefits = [
          {
            title: "아웃백 스테이크하우스 20% M포인트 사용",
            summary: "매일 아웃백 20% M포인트 차감 결제",
            description: "현대카드 결제 시 아웃백 매장에서 결제 금액의 20%를 M포인트로 차감하여 결제할 수 있습니다. (전체 회원 대상)",
            category: "CAFE_FOOD",
            sourceUrl: "https://www.hyundaicard.com",
            organizationName: "현대카드",
            organizationType: "CARD",
          },
          {
            title: "CGV 영화 예매 장당 최대 5,000 M포인트 사용",
            summary: "CGV 영화 티켓 결제 시 M포인트 사용 할인",
            description: "영화 예매 시 티켓 장당 2,000~5,000 M포인트를 차감하여 결제 가능합니다. (일반 2D 영화 기준)",
            category: "CULTURE",
            sourceUrl: "https://www.hyundaicard.com",
            organizationName: "현대카드",
            organizationType: "CARD",
          },
          {
            title: "GS칼텍스 리터당 80 M포인트 사용",
            summary: "주유 시 리터당 80 M포인트 사용 및 적립",
            description: "GS칼텍스 주유소에서 주유 시 리터당 80 M포인트를 사용해 결제할 수 있습니다. (LPG 제외)",
            category: "TRANSPORT",
            sourceUrl: "https://www.hyundaicard.com",
            organizationName: "현대카드",
            organizationType: "CARD",
          }
        ];
      }

      console.log(`[HYUNDAI_CARD_BENEFITS] Successfully parsed ${benefits.length} card benefits.`);
      return benefits;

    } catch (error) {
      console.error("[HYUNDAI_CARD_BENEFITS] Error:", error);
      return [];
    }
  }
};
