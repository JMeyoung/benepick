import { Aggregator, AggregatedBenefit } from './types';

export const exampleMockAggregator: Aggregator = {
  name: "EXAMPLE_BANK",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[EXAMPLE_BANK] Starting data aggregation...");

    // In a real scenario, you would fetch data from the undocumented API here:
    // const res = await fetch('https://api.examplebank.com/v1/benefits');
    // const data = await res.json();
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response
    const mockData: AggregatedBenefit[] = [
      {
        title: "스타벅스 50% 할인 (예시)",
        summary: "매주 수요일 스타벅스 반값",
        description: "수요일마다 사이렌오더 결제 시 50% 청구할인 (월 최대 1만원)",
        category: "CAFE",
        sourceUrl: "https://example.com/benefits/1",
        organizationName: "예시은행",
        organizationType: "BANK",
      },
      {
        title: "영화관 1+1 (예시)",
        summary: "CGV, 롯데시네마, 메가박스 티켓 1+1",
        description: "전월 실적 30만원 이상 시 주말 영화 티켓 1+1 혜택 제공",
        category: "CULTURE",
        sourceUrl: "https://example.com/benefits/2",
        organizationName: "예시은행",
        organizationType: "BANK",
        endsAt: new Date(new Date().getFullYear(), 11, 31), // End of year
      }
    ];

    console.log(`[EXAMPLE_BANK] Successfully fetched ${mockData.length} benefits.`);
    return mockData;
  }
};
