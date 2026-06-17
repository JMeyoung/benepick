import { Aggregator, AggregatedBenefit } from './types';
import { smartFetch } from '../utils/proxyFetcher';

/**
 * 온통청년(youthcenter.go.kr) Open API 연동 Aggregator
 *
 * 전국 청년 정책 정보를 수집합니다 (일자리, 주거, 교육, 복지, 참여·권리, 문화·여가).
 *
 * 환경변수:
 *   YOUTH_CENTER_API_KEY — youthcenter.go.kr에서 발급받은 Open API 인증키
 *     (마이페이지 → OPEN API → 인증키 신청)
 *
 * API 키가 없을 시 서울 청년 정책 기본 데이터를 fallback으로 반환합니다.
 *
 * @see https://www.youthcenter.go.kr/opi/youthPlcyList.do
 */
export const youthCenterAggregator: Aggregator = {
  name: "YOUTH_CENTER_POLICY",
  run: async (): Promise<AggregatedBenefit[]> => {
    console.log("[YOUTH_CENTER_POLICY] Starting data aggregation...");

    try {
      const apiKey = process.env.YOUTH_CENTER_API_KEY;
      let benefits: AggregatedBenefit[] = [];

      if (apiKey) {
        console.log("[YOUTH_CENTER_POLICY] API key found. Fetching live data from youthcenter.go.kr...");
        benefits = await fetchYouthPolicies(apiKey);
      }

      // API 키가 없거나 호출에 실패한 경우, fallback 데이터 사용
      if (benefits.length === 0) {
        console.log("[YOUTH_CENTER_POLICY] Using fallback youth benefits data...");
        benefits = getFallbackBenefits();
      }

      console.log(`[YOUTH_CENTER_POLICY] Successfully parsed ${benefits.length} government benefits.`);
      return benefits;

    } catch (error) {
      console.error("[YOUTH_CENTER_POLICY] Error parsing youth policies:", error);
      return getFallbackBenefits();
    }
  }
};

/**
 * 온통청년 Open API에서 청년 정책 데이터를 가져옵니다.
 * 응답 형식: XML
 */
async function fetchYouthPolicies(apiKey: string): Promise<AggregatedBenefit[]> {
  const benefits: AggregatedBenefit[] = [];
  let pageIndex = 1;
  const display = 100; // 한 페이지당 최대 100건
  const maxPages = 5;  // 안전장치: 최대 500건

  while (pageIndex <= maxPages) {
    const url = `https://www.youthcenter.go.kr/opi/youthPlcyList.do?openApiVlak=${apiKey}&display=${display}&pageIndex=${pageIndex}`;

    try {
      const res = await smartFetch(url);

      if (!res.ok) {
        console.error(`[YOUTH_CENTER_POLICY] API responded with status ${res.status} on page ${pageIndex}`);
        break;
      }

      const text = await res.text();
      const pageBenefits = parseYouthPolicyXml(text);

      if (pageBenefits.length === 0) {
        break; // 더 이상 데이터 없음
      }

      benefits.push(...pageBenefits);

      if (pageBenefits.length < display) {
        break; // 마지막 페이지
      }

      pageIndex++;
    } catch (error) {
      console.error(`[YOUTH_CENTER_POLICY] Fetch error on page ${pageIndex}:`, error);
      break;
    }
  }

  return benefits;
}

/**
 * 온통청년 API의 XML 응답을 AggregatedBenefit 배열로 변환합니다.
 * XML 파서 라이브러리 없이 정규식으로 간단히 파싱합니다.
 */
function parseYouthPolicyXml(xml: string): AggregatedBenefit[] {
  const benefits: AggregatedBenefit[] = [];

  // <youthPolicy> 태그 단위로 분리
  const policyBlocks = xml.match(/<youthPolicy>([\s\S]*?)<\/youthPolicy>/g);
  if (!policyBlocks) return [];

  for (const block of policyBlocks) {
    const title = extractXmlTag(block, 'polyBizSjnm') || '';
    const summary = extractXmlTag(block, 'polyItcnCn') || '';
    const description = extractXmlTag(block, 'sporCn') || extractXmlTag(block, 'polyItcnCn') || '';
    const region = extractXmlTag(block, 'polyBizSecd');
    const orgName = extractXmlTag(block, 'cnsgNmor') || '온통청년';
    const policyId = extractXmlTag(block, 'bizId') || '';

    // 분야 코드로 카테고리 매핑
    const bizType = extractXmlTag(block, 'polyRlmCd') || '';

    if (!title) continue;

    benefits.push({
      title,
      summary: summary.length > 100 ? summary.slice(0, 97) + '...' : summary,
      description,
      category: 'GOV_POLICY',
      sourceUrl: policyId
        ? `https://www.youthcenter.go.kr/youngPlcy/youngPlcyUnif/youngPlcyUnifDtl.do?bizId=${policyId}`
        : 'https://www.youthcenter.go.kr',
      organizationName: orgName || '온통청년',
      organizationType: 'GOVERNMENT',
      region: mapYouthRegion(region),
    });
  }

  return benefits;
}

/** XML 태그에서 텍스트 내용을 추출하는 헬퍼 */
function extractXmlTag(xml: string, tagName: string): string | null {
  // CDATA 지원
  const cdataMatch = xml.match(new RegExp(`<${tagName}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tagName}>`));
  if (cdataMatch) return cdataMatch[1].trim();

  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`));
  return match ? match[1].trim() : null;
}

/** 온통청년 지역 코드 → 베네픽 지역명 매핑 */
function mapYouthRegion(code: string | null): string | null {
  if (!code) return null;
  const regionMap: Record<string, string> = {
    '003002001': '서울',
    '003002002': '부산',
    '003002003': '대구',
    '003002004': '인천',
    '003002005': '광주',
    '003002006': '대전',
    '003002007': '울산',
    '003002008': '경기',
    '003002009': '강원',
    '003002010': '충북',
    '003002011': '충남',
    '003002012': '전북',
    '003002013': '전남',
    '003002014': '경북',
    '003002015': '경남',
    '003002016': '제주',
    '003002017': '세종',
  };
  return regionMap[code] || null;
}

/** API 키 없을 시 사용되는 기본 청년 혜택 데이터 */
function getFallbackBenefits(): AggregatedBenefit[] {
  return [
    {
      title: "서울 청년 수당",
      summary: "미취업 청년에게 월 50만원씩 최대 6개월 간 지원",
      description: "서울시에 주민등록을 둔 만 19세~34세 미취업 청년 중 중위소득 150% 이하 대상. 교육비, 자격증 접수비 등으로 사용 가능한 바우처 지급.",
      category: "GOV_POLICY",
      sourceUrl: "https://youth.seoul.go.kr",
      organizationName: "서울특별시",
      organizationType: "GOVERNMENT",
      region: "서울",
    },
    {
      title: "청년 월세 지원",
      summary: "만 19세~39세 청년에게 월 최대 20만원 지원",
      description: "서울시 거주 무주택 청년 대상, 보증금 5천만원 이하 및 월세 60만원 이하 건물에 거주하는 자 중 기준 중위소득 120% 이하 해당 시 월 20만원 지원 (최대 10회).",
      category: "GOV_POLICY",
      sourceUrl: "https://youth.seoul.go.kr",
      organizationName: "서울특별시",
      organizationType: "GOVERNMENT",
      region: "서울",
    },
    {
      title: "청년 대중교통비 지원",
      summary: "교통비 사용 금액의 20%를 마일리지로 환급",
      description: "서울시에 거주하는 만 19세~24세 청년 대상, 연간 최대 10만원 한도로 버스/지하철 이용금액의 20%를 교통 마일리지로 환급해 줍니다.",
      category: "GOV_POLICY",
      sourceUrl: "https://youth.seoul.go.kr",
      organizationName: "서울특별시",
      organizationType: "GOVERNMENT",
      region: "서울",
    }
  ];
}
