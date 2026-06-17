import { Aggregator, AggregatedBenefit } from './types';
import { smartFetch } from '../utils/proxyFetcher';

/**
 * 쿠콘(Coocon) 카드 혜택 비교 API 연동 Aggregator
 *
 * 쿠콘은 국내 전 카드사(신한·삼성·현대·KB·롯데·우리·하나·BC)의
 * 혜택 정보를 표준화된 RESTful API로 제공하는 B2B 데이터 플랫폼입니다.
 *
 * 환경변수:
 *   COOCON_API_KEY  — 쿠콘 계약 후 발급받는 API 인증키
 *   COOCON_API_URL  — 쿠콘 카드 혜택 API 엔드포인트
 *
 * 계약 전에는 빈 배열을 반환하며, 기존 크롤러 데이터(현대카드 등)와 공존합니다.
 * 계약 후 API 키와 URL을 설정하면 자동으로 실데이터 수집이 시작됩니다.
 *
 * @see https://www.coocon.net
 */
export const cooconCardAggregator: Aggregator = {
  name: "COOCON_CARD_BENEFITS",
  run: async (): Promise<AggregatedBenefit[]> => {
    const apiKey = process.env.COOCON_API_KEY;
    const apiUrl = process.env.COOCON_API_URL;

    if (!apiKey || !apiUrl) {
      console.log("[COOCON_CARD_BENEFITS] API key or URL not configured. Skipping. (B2B 계약 후 coocon.net에서 발급)");
      return [];
    }

    console.log("[COOCON_CARD_BENEFITS] Starting card benefits aggregation via Coocon API...");

    try {
      const res = await smartFetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Coocon API responded with status: ${res.status}`);
      }

      const rawData = await res.json();

      // 쿠콘 API 응답 구조에 맞춰 파싱 (실제 연동 시 응답 스키마에 따라 조정 필요)
      // 예상 구조: { data: [{ cardCompany, benefitName, description, ... }] }
      const items = rawData.data || rawData.items || rawData.results || [];

      const benefits: AggregatedBenefit[] = items.map((item: Record<string, string>) => {
        // 카드사 코드 → organizationName 매핑
        const cardIssuerMap: Record<string, string> = {
          'SHINHAN': '신한카드',
          'SAMSUNG': '삼성카드',
          'HYUNDAI': '현대카드',
          'KB': 'KB국민카드',
          'LOTTE': '롯데카드',
          'WOORI': '우리카드',
          'HANA': '하나카드',
          'BC': 'BC카드',
        };

        const orgName = cardIssuerMap[item.cardCompany || item.issuerCode || ''] 
          || item.cardCompanyName 
          || item.cardCompany 
          || '카드사';

        return {
          title: item.benefitName || item.title || '',
          summary: item.summary || item.benefitSummary || item.description?.slice(0, 80) || '',
          description: item.description || item.benefitDetail || '',
          category: mapCooconCategory(item.category || item.categoryCode || ''),
          sourceUrl: item.sourceUrl || item.detailUrl || `https://www.coocon.net`,
          organizationName: orgName,
          organizationType: 'CARD',
          endsAt: item.endDate ? new Date(item.endDate) : null,
        };
      });

      console.log(`[COOCON_CARD_BENEFITS] Successfully parsed ${benefits.length} card benefits from Coocon API.`);
      return benefits;

    } catch (error) {
      console.error("[COOCON_CARD_BENEFITS] Error during API call:", error);
      return [];
    }
  }
};

/**
 * 쿠콘 카테고리 코드 → 베네픽 카테고리 코드 매핑
 * 실제 쿠콘 API 연동 후 응답 데이터의 카테고리 체계에 맞춰 조정 필요
 */
function mapCooconCategory(cooconCategory: string): string {
  const map: Record<string, string> = {
    'FOOD': 'CAFE_FOOD',
    'CAFE': 'CAFE_FOOD',
    'RESTAURANT': 'CAFE_FOOD',
    'SHOPPING': 'SHOPPING',
    'ONLINE_SHOPPING': 'SHOPPING',
    'MOVIE': 'CULTURE',
    'CULTURE': 'CULTURE',
    'TRAVEL': 'CULTURE',
    'EDUCATION': 'EDUCATION',
    'TRANSPORT': 'TRANSPORT',
    'OIL': 'TRANSPORT',
    'GAS': 'TRANSPORT',
    'TELECOM': 'TELECOM',
    'FINANCE': 'FINANCE',
    'INSURANCE': 'FINANCE',
    'BEAUTY': 'BEAUTY_HEALTH',
    'HEALTH': 'BEAUTY_HEALTH',
    'MEDICAL': 'BEAUTY_HEALTH',
    'LIFE': 'LIFE',
    'CONVENIENCE': 'LIFE',
  };

  return map[cooconCategory.toUpperCase()] || 'LIFE';
}
