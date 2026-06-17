import { Aggregator, AggregatedBenefit } from './types';

/**
 * Wello(웰로) 정책 API 연동 Aggregator
 *
 * 2,700개+ 정부 소스에서 수집한 정책·복지 혜택 정보를 AI 기반으로 제공합니다.
 * 맞춤형 정책 매칭(연령, 소득, 지역, 가구 유형) 기능을 지원합니다.
 *
 * 환경변수:
 *   WELLO_API_KEY  — welloapi.com에서 계약 후 발급받는 API 인증키
 *   WELLO_API_URL  — Wello API 엔드포인트 (계약 시 제공)
 *
 * 유료 상용 API이므로, 계약 전에는 빈 배열을 반환합니다.
 *
 * @see https://welloapi.com
 */
export const welloPolicyAggregator: Aggregator = {
  name: "WELLO_POLICY",
  run: async (): Promise<AggregatedBenefit[]> => {
    const apiKey = process.env.WELLO_API_KEY;
    const apiUrl = process.env.WELLO_API_URL;

    if (!apiKey || !apiUrl) {
      console.log("[WELLO_POLICY] API key or URL not configured. Skipping. (welloapi.com에서 계약 후 발급)");
      return [];
    }

    console.log("[WELLO_POLICY] Starting policy aggregation via Wello API...");

    try {
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Wello API responded with status: ${res.status}`);
      }

      const rawData = await res.json();

      // Wello API 응답 구조에 맞춰 파싱 (실제 연동 시 응답 스키마에 따라 조정 필요)
      const items = rawData.data || rawData.policies || rawData.results || [];

      const benefits: AggregatedBenefit[] = items.map((item: Record<string, string>) => ({
        title: item.title || item.policyName || '',
        summary: (item.summary || item.description || '').slice(0, 100),
        description: item.description || item.detail || item.supportContent || '',
        category: 'GOV_POLICY',
        sourceUrl: item.sourceUrl || item.detailUrl || item.applyUrl || 'https://wello.info',
        organizationName: item.organizationName || item.ministry || item.agency || '정부',
        organizationType: 'GOVERNMENT',
        region: item.region || null,
        endsAt: item.endDate ? new Date(item.endDate) : null,
      }));

      console.log(`[WELLO_POLICY] Successfully parsed ${benefits.length} policy benefits from Wello API.`);
      return benefits;

    } catch (error) {
      console.error("[WELLO_POLICY] Error during API call:", error);
      return [];
    }
  }
};
