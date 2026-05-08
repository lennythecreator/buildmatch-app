import { bidService, jobService } from '@/lib/api/services';
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
    queryKey: ['contractor', 'bids', contractorId ?? 'me'],
    enabled: isAuthenticated && !isLoadingAuth,
    queryFn: async () => {
      const jobsResponse = await jobService.getMyBids();
      const jobs = jobsResponse.jobs ?? [];

      const resolvedBids: Array<BidWithJob | null> = await Promise.all(
        jobs.map(async (job) => {
          const bid = await bidService.getMyBid(job.id);

          if (contractorId && bid.contractorId !== contractorId) {
            return null;
          }

          return {
            ...bid,
            job: bid.job ?? job,
          };
        })
      );

      return resolvedBids
        .filter((bid): bid is BidWithJob => bid !== null)
        .sort((left: BidWithJob, right: BidWithJob) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
    },
  });
}
