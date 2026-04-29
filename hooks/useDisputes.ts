import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { disputeService } from '@/lib/api/services';
import type { CreateDisputeInput } from '@/lib/api/services';

export const DISPUTE_QUERY_KEY = ['disputes'] as const;

export function useDisputeSummary() {
  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'summary'],
    queryFn: () => disputeService.getSummary(),
  });
}

export function useDisputes(filters?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'list', filters],
    queryFn: () => disputeService.list(filters),
  });
}

export function useDispute(id: string) {
  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'detail', id],
    queryFn: () => disputeService.get(id),
    enabled: !!id,
  });
}

export function useDisputeMessages(id: string) {
  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'detail', id, 'messages'],
    queryFn: () => disputeService.getMessages(id),
    enabled: !!id,
    refetchInterval: 10000,
  });
}

export function useDisputeEvidence(id: string) {
  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'detail', id, 'evidence'],
    queryFn: () => disputeService.getEvidence(id),
    enabled: !!id,
  });
}

export function useCreateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDisputeInput) => disputeService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISPUTE_QUERY_KEY });
    },
  });
}

export function useAddDisputeMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, content }: { disputeId: string; content: string }) =>
      disputeService.addMessage(disputeId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DISPUTE_QUERY_KEY, 'detail', variables.disputeId, 'messages'],
      });
    },
  });
}

export function useAddDisputeEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      disputeId,
      type,
      url,
      description,
    }: {
      disputeId: string;
      type: string;
      url: string;
      description?: string;
    }) => disputeService.addEvidence(disputeId, type, url, description),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DISPUTE_QUERY_KEY, 'detail', variables.disputeId, 'evidence'],
      });
    },
  });
}

export function useWithdrawDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, reason }: { disputeId: string; reason: string }) =>
      disputeService.withdraw(disputeId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISPUTE_QUERY_KEY });
    },
  });
}
