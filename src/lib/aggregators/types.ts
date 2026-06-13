export interface AggregatedBenefit {
  title: string;
  summary: string;
  description: string;
  category: string;
  sourceUrl: string;
  organizationName: string;
  organizationType: string;
  endsAt?: Date | null;
  region?: string | null;
}

export interface Aggregator {
  /**
   * The name of the aggregator, e.g., "SKT_TMEMBERSHIP"
   */
  name: string;

  /**
   * Runs the data collection process.
   * Returns a list of standardized Benefit objects.
   */
  run: () => Promise<AggregatedBenefit[]>;
}
