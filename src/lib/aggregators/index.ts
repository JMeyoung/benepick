import { Aggregator } from './types';
import { sktTMembershipAggregator } from './sktTMembership';
import { youthCenterAggregator } from './youthCenter';
import { hyundaiCardAggregator } from './hyundaiCard';
import { cooconCardAggregator } from './cooconCard';
import { jeonggaCardAggregator } from './jeonggaCard';
import { mvnoPlansAggregator } from './mvnoPlans';
import { convenienceDealsAggregator } from './convenienceDeals';
import { naverPlusAggregator } from './naverPlus';
import { cjOneAggregator } from './cjOne';
import { happyPointAggregator } from './happyPoint';
import { unidaysKoreaAggregator } from './unidaysKorea';
import { govSubsidyAggregator } from './govSubsidy';
import { welloPolicyAggregator } from './welloPolicy';

// Register all active aggregators here
export const aggregators: Aggregator[] = [
  // 카드 혜택
  hyundaiCardAggregator,
  cooconCardAggregator,
  jeonggaCardAggregator, // 정가거부 추천 가성비 카드

  // 통신사 멤버십 / 알뜰폰
  sktTMembershipAggregator,
  mvnoPlansAggregator, // 알뜰폰(MVNO) 요금제

  // 편의점·생활 행사
  convenienceDealsAggregator,

  // 브랜드 멤버십·포인트 제도
  naverPlusAggregator,    // 네이버플러스
  cjOneAggregator,        // CJ ONE(CGV·올리브영·뚜레쥬르)
  happyPointAggregator,   // 해피포인트(SPC — 파리바게뜨·베스킨·GS25)
  unidaysKoreaAggregator, // 유니데이즈 학생 할인

  // 정부·정책
  youthCenterAggregator,
  govSubsidyAggregator,
  welloPolicyAggregator,
];

export async function runAllAggregators() {
  const results = [];
  
  for (const aggregator of aggregators) {
    try {
      const data = await aggregator.run();
      results.push({ name: aggregator.name, status: 'success', count: data.length, data });
    } catch (error) {
      console.error(`[Aggregator Error] Failed to run ${aggregator.name}:`, error);
      results.push({ name: aggregator.name, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  return results;
}
