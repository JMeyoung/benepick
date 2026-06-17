import { Aggregator } from './types';
import { sktTMembershipAggregator } from './sktTMembership';
import { youthCenterAggregator } from './youthCenter';
import { hyundaiCardAggregator } from './hyundaiCard';
import { cooconCardAggregator } from './cooconCard';
import { govSubsidyAggregator } from './govSubsidy';
import { welloPolicyAggregator } from './welloPolicy';

// Register all active aggregators here
export const aggregators: Aggregator[] = [
  // 카드 혜택
  hyundaiCardAggregator,
  cooconCardAggregator,

  // 통신사 멤버십
  sktTMembershipAggregator,

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
