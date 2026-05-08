import { aiService } from '@/lib/api/services';
import { useQuery } from '@tanstack/react-query';

export interface ReliabilityScoreFactor {
  name: string;
  impact: number;
  description: string;
}

export interface ReliabilityScoreData {
  score: number;
  factors: ReliabilityScoreFactor[];
  isEstimated: boolean;
}

const DEFAULT_FACTORS: ReliabilityScoreFactor[] = [
  { name: 'Response rate', impact: 25, description: 'How quickly you reply when a developer reaches out.' },
  { name: 'On-time completion', impact: 25, description: 'Whether work is delivered when you said it would be.' },
  { name: 'Bid accuracy', impact: 20, description: 'How close your submitted bids are to the final project scope.' },
  { name: 'Completion rate', impact: 10, description: 'How many accepted jobs are finished successfully.' },
  { name: 'Dispute history', impact: 10, description: 'How often completed work results in disputes.' },
];

const FALLBACK_SCORE = 78;

function normalizeReliabilityScore(score?: number, factors?: ReliabilityScoreFactor[]): ReliabilityScoreData {
  return {
    score: typeof score === 'number' ? score : FALLBACK_SCORE,
    factors: factors && factors.length > 0 ? factors : DEFAULT_FACTORS,
    isEstimated: typeof score !== 'number',
  };
}

export function useReliabilityScore() {
  return useQuery({
    queryKey: ['ai', 'reliability', 'me'],
    queryFn: async () => {
      try {
        const response = await aiService.getReliabilityScore();

        return normalizeReliabilityScore(
          response.score,
          response.factors.map((factor) => ({
            name: factor.name,
            impact: factor.impact,
            description: factor.description,
          }))
        );
      } catch {
        return normalizeReliabilityScore();
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}