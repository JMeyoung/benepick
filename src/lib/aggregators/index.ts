import { Aggregator } from './types';
import { exampleMockAggregator } from './exampleMock';
import { sktTMembershipAggregator } from './sktTMembership';
import { seoulYouthAggregator } from './seoulYouth';
import { hyundaiCardAggregator } from './hyundaiCard';

// Register all active aggregators here
export const aggregators: Aggregator[] = [
  exampleMockAggregator,
  sktTMembershipAggregator,
  seoulYouthAggregator,
  hyundaiCardAggregator,
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
