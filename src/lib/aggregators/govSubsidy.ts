import { Aggregator, AggregatedBenefit } from './types';

/**
 * 보조금24 / 행정안전부 공공서비스(혜택) 정보 API 연동 Aggregator
 *
 * 중앙정부 및 지자체에서 제공하는 공공서비스·보조금·복지 혜택 정보를 수집합니다.
 *
 * 환경변수:
 *   GOV_DATA_API_KEY — data.go.kr에서 발급받은 공공데이터 API 인증키
 *     (data.go.kr → "행정안전부_대한민국 공공서비스(혜택) 정보" 검색 → 활용신청)
 *
 * API 키가 없을 시 빈 배열을 반환합니다.
 *
 * @see https://api.odcloud.kr/api/gov24/v3/serviceList
 */
export const govSubsidyAggregator: Aggregator = {
  name: "GOV_SUBSIDY_24",
  run: async (): Promise<AggregatedBenefit[]> => {
    const apiKey = process.env.GOV_DATA_API_KEY;

    if (!apiKey) {
      console.log("[GOV_SUBSIDY_24] API key not configured. Skipping. (data.go.kr에서 무료 발급 가능)");
      return [];
    }

    console.log("[GOV_SUBSIDY_24] Starting government subsidy aggregation...");

    try {
      const benefits: AggregatedBenefit[] = [];
      let page = 1;
      const perPage = 100;
      const maxPages = 10; // 안전장치: 최대 1000건

      while (page <= maxPages) {
        const url = new URL('https://api.odcloud.kr/api/gov24/v3/serviceList');
        url.searchParams.set('page', String(page));
        url.searchParams.set('perPage', String(perPage));
        url.searchParams.set('serviceKey', apiKey);

        const res = await fetch(url.toString(), {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          console.error(`[GOV_SUBSIDY_24] API responded with status ${res.status} on page ${page}`);
          break;
        }

        const json = await res.json();
        const items = json.data || [];

        if (items.length === 0) break;

        for (const item of items) {
          const title = item['서비스명'] || item.serviceName || '';
          const summary = item['서비스목적요약'] || item.servicePurposeSummary || '';
          const description = item['지원내용'] || item.supportContent || item['서비스목적요약'] || '';
          const orgName = item['소관기관명'] || item.organizationName || '정부';
          const serviceId = item['서비스ID'] || item.serviceId || '';

          if (!title) continue;

          benefits.push({
            title,
            summary: summary.length > 100 ? summary.slice(0, 97) + '...' : summary,
            description,
            category: 'GOV_POLICY',
            sourceUrl: serviceId
              ? `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/${serviceId}`
              : 'https://www.gov.kr',
            organizationName: orgName,
            organizationType: 'GOVERNMENT',
            region: extractRegion(item['소관기관명'] || ''),
          });
        }

        if (items.length < perPage) break;
        page++;
      }

      console.log(`[GOV_SUBSIDY_24] Successfully parsed ${benefits.length} government service benefits.`);
      return benefits;

    } catch (error) {
      console.error("[GOV_SUBSIDY_24] Error during API call:", error);
      return [];
    }
  }
};

/**
 * 기관명에서 지역명을 추출하는 헬퍼
 * 예: "서울특별시" → "서울", "경기도 수원시" → "경기"
 */
function extractRegion(orgName: string): string | null {
  const regionPatterns: [RegExp, string][] = [
    [/서울/, '서울'],
    [/경기/, '경기'],
    [/인천/, '인천'],
    [/부산/, '부산'],
    [/대구/, '대구'],
    [/광주/, '광주'],
    [/대전/, '대전'],
    [/울산/, '울산'],
    [/세종/, '세종'],
    [/강원/, '강원'],
    [/충북|충청북/, '충북'],
    [/충남|충청남/, '충남'],
    [/전북|전라북/, '전북'],
    [/전남|전라남/, '전남'],
    [/경북|경상북/, '경북'],
    [/경남|경상남/, '경남'],
    [/제주/, '제주'],
  ];

  for (const [pattern, region] of regionPatterns) {
    if (pattern.test(orgName)) return region;
  }

  return null; // 중앙정부 기관 등 지역 특정 불가
}
