import { escrowService } from '@/lib/api/services';
import { buildProfileCompletionUrl } from '@/lib/escrow/profile-completion-url';
import type { DisputeMilestoneInput, EscrowOnboardInput, FundJobInput, SubmitMilestoneInput } from '@/lib/api/types';
import { useAuthStore } from '@/store/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const ESCROW_QUERY_KEY = ['escrow'] as const;

export function useEscrowOnboardStatus() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: [...ESCROW_QUERY_KEY, 'onboard-status'],
    queryFn: () => escrowService.getOnboardStatus(),
    enabled: isAuthenticated && !isLoading,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useEscrowOnboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId?: string) => {
      const input: EscrowOnboardInput | undefined = jobId
        ? { profileCompletionUrl: buildProfileCompletionUrl(jobId) }
        : undefined;
      return escrowService.onboard(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ESCROW_QUERY_KEY, 'onboard-status'] });
    },
  });
}

export function useAcceptEscrowTerms() {
  return useMutation({
    mutationFn: (jobId: string) => escrowService.acceptTerms(jobId),
  });
}

export function useEscrowPayment(jobId: string) {
  return useQuery({
    queryKey: [...ESCROW_QUERY_KEY, 'payment', jobId],
    queryFn: () => escrowService.getByJob(jobId),
    enabled: !!jobId,
    retry: 1,
  });
}

export function useFundEscrowFromJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      input,
    }: {
      jobId: string;
      input: FundJobInput;
    }) => escrowService.fundJob(jobId, input),
    onSuccess: (result) => {
      const jobId = result.escrowPayment.jobId;
      queryClient.setQueryData([...ESCROW_QUERY_KEY, 'payment', jobId], result.escrowPayment);
      queryClient.invalidateQueries({ queryKey: [...ESCROW_QUERY_KEY, 'payment', jobId] });
    },
  });
}

export function useSubmitMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      milestoneId,
      input,
    }: {
      jobId: string;
      milestoneId: string;
      input?: SubmitMilestoneInput;
    }) => escrowService.submitMilestone(jobId, milestoneId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...ESCROW_QUERY_KEY, 'payment', variables.jobId] });
    },
  });
}

export function useApproveMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      milestoneId,
    }: {
      jobId: string;
      milestoneId: string;
    }) => escrowService.approveMilestone(jobId, milestoneId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...ESCROW_QUERY_KEY, 'payment', variables.jobId] });
    },
  });
}

export function useDisputeMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      milestoneId,
      input,
    }: {
      jobId: string;
      milestoneId: string;
      input: DisputeMilestoneInput;
    }) => escrowService.disputeMilestone(jobId, milestoneId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...ESCROW_QUERY_KEY, 'payment', variables.jobId] });
    },
  });
}
