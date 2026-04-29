import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bidService } from '@/lib/api/services';
import type { CreateBidInput } from '@/lib/api/types';

export const BID_QUERY_KEY = ['bids'] as const;

export function useBids(jobId: string) {
  return useQuery({
    queryKey: [...BID_QUERY_KEY, 'job', jobId],
    queryFn: () => bidService.list(jobId),
    enabled: !!jobId,
  });
}

export function useMyBid(jobId: string) {
  return useQuery({
    queryKey: [...BID_QUERY_KEY, 'my-bid', jobId],
    queryFn: () => bidService.getMyBid(jobId),
    enabled: !!jobId,
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
