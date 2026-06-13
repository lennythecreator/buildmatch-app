import { QUERY_KEYS } from '@/lib/api/query-keys';
import { jobService } from '@/lib/api/services';
import type { Bid } from '@/lib/api/types';
import { useAuthStore } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';

type BidWithJob = Omit<Bid, 'job'> & {
  job: NonNullable<Bid['job']>;
};

export function useActiveBids(contractorId?: string) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoadingAuth = useAuthStore((state) => state.isLoading);

  return useQuery<BidWithJob[], Error>({
    queryKey: QUERY_KEYS.CONTRACTOR_BIDS(contractorId),
    enabled: isAuthenticated && !isLoadingAuth,
    queryFn: async () => {
      const response = await jobService.getMyBids();
      const items = Array.isArray(response) ? response : (response as { jobs?: Bid[] }).jobs ?? [];

      const resolvedBids: Array<BidWithJob | null> = items.map((item) => {
        if (!item.job) return null;

        if (contractorId && item.contractorId !== contractorId) {
          return null;
        }

        return item as BidWithJob;
      });

      return resolvedBids
        .filter((bid): bid is BidWithJob => bid !== null)
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
    },
  });
}
