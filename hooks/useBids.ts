import { bidService } from '@/lib/api/services';
import type { Bid, BidListResponse, CreateBidInput } from '@/lib/api/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const BID_QUERY_KEY = ['bids'] as const;

interface BidQueryOptions {
  enabled?: boolean;
}

function normalizeBidListResponse(response: BidListResponse | Bid[]): BidListResponse {
  if (Array.isArray(response)) {
    return {
      bids: response,
      total: response.length,
      page: 1,
      limit: response.length,
    };
  }

  return response;
}

export function useBids(jobId: string, options?: BidQueryOptions) {
  return useQuery({
    queryKey: [...BID_QUERY_KEY, 'job', jobId],
    queryFn: async () => {
      if (__DEV__) {
        console.log('[bids] fetching bids', { jobId });
      }

      try {
        const response = await bidService.list(jobId);
        const normalizedResponse = normalizeBidListResponse(response);

        if (__DEV__) {
          console.log('[bids] fetch success', {
            jobId,
            count: normalizedResponse.bids.length,
            response: normalizedResponse,
          });
        }

        return normalizedResponse;
      } catch (error) {
        if (__DEV__) {
          console.error('[bids] fetch failed', { jobId, error });
        }

        throw error;
      }
    },
    enabled: (options?.enabled ?? true) && !!jobId,
  });
}

export function useMyBid(jobId: string, options?: BidQueryOptions) {
  return useQuery({
    queryKey: [...BID_QUERY_KEY, 'my-bid', jobId],
    queryFn: () => bidService.getMyBid(jobId),
    enabled: (options?.enabled ?? true) && !!jobId,
  });
}

export function useCreateBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, input }: { jobId: string; input: CreateBidInput }) =>
      bidService.create(jobId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...BID_QUERY_KEY, 'job', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: [...BID_QUERY_KEY, 'my-bid', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'my-bids'] });
    },
  });
}

export function useAcceptBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, bidId }: { jobId: string; bidId: string }) =>
      bidService.accept(jobId, bidId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...BID_QUERY_KEY, 'job', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'detail', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'my-jobs'] });
    },
  });
}

export function useWithdrawBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, bidId }: { jobId: string; bidId: string }) =>
      bidService.withdraw(jobId, bidId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...BID_QUERY_KEY, 'job', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: [...BID_QUERY_KEY, 'my-bid', variables.jobId] });
    },
  });
}
