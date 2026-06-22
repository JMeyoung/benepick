import { Aggregator, AggregatedBenefit } from './types';

export const sktTMembershipAggregator: Aggregator = {
  name: "SKT_TMEMBERSHIP",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[SKT_TMEMBERSHIP] Starting data aggregation...");

    try {
      // TODO: 실제 T멤버십 API 주소/헤더를 Chrome 개발자 도구(Network 탭)에서 찾아 연결해야 합니다.
      // 아래는 연결 전 형태를 보여주는 예시이며, 현재는 mock 데이터를 반환하는 스텁입니다.
      // const apiUrl = 'https://tmembership.tworld.co.kr/api/benefits';
      /*
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 ...', // 봇 차단을 막기 위해 일반 브라우저 헤더 추가 권장
          // 'Authorization': 'Bearer ...' // 필요시 토큰 추가
        }
      });

      if (!res.ok) {
        throw new Error(`SKT API responded with status: ${res.status}`);
      }

      const rawData = await res.json();
      */

      // 실제 API 통신 전 테스트를 위한 Mock 데이터 배열입니다.
      // API 통신이 성공하면 rawData.items.map(...) 형태로 변환(Mapping)해주면 됩니다.
      const parsedBenefits: AggregatedBenefit[] = [
        {
          title: "[T day] 뚜레쥬르 최대 30% 할인",
          summary: "매월 첫째 주 T day 한정 혜택",
          description: "T멤버십 바코드를 제시하면 결제 금액의 30% 할인 (최대 1만원 한도)",
          category: "CAFE_FOOD",
          sourceUrl: "https://tmembership.tworld.co.kr/web/html/coupon/tday.jsp", // 실제 혜택 안내 페이지 URL
          organizationName: "SKT",
          organizationType: "TELECOM",
        },
        {
          title: "CU 편의점 천원당 100원 할인",
          summary: "상시 할인 혜택 (VIP 기준)",
          description: "결제 금액 천원당 100원 할인 (일 1회 한정)",
          category: "LIFE",
          sourceUrl: "https://tmembership.tworld.co.kr/web/html/coupon/detail.jsp",
          organizationName: "SKT",
          organizationType: "TELECOM",
        }
      ];

      console.log(`[SKT_TMEMBERSHIP] Successfully processed ${parsedBenefits.length} benefits.`);
      return parsedBenefits;

    } catch (error) {
      console.error("[SKT_TMEMBERSHIP] Error during aggregation:", error);
      throw error;
    }
  }
};
