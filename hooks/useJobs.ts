import { jobService } from '@/lib/api/services';
import type { CreateJobInput, JobFilters } from '@/lib/api/types';
import { useAuthStore } from '@/store/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const JOB_QUERY_KEY = ['jobs'] as const;

export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: [...JOB_QUERY_KEY, 'list', filters],
    queryFn: () => jobService.list(filters),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: [...JOB_QUERY_KEY, 'detail', id],
    queryFn: () => jobService.get(id),
    enabled: !!id,
  });
}

export function useMyJobs() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: [...JOB_QUERY_KEY, 'my-jobs'],
    queryFn: () => jobService.getMyJobs(),
    enabled: isAuthenticated && !isLoading,
  });
}

export function useMyBids() {
  return useQuery({
    queryKey: [...JOB_QUERY_KEY, 'my-bids'],
    queryFn: () => jobService.getMyBids(),
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateJobInput) => jobService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'my-jobs'] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateJobInput> }) =>
      jobService.update(id, input),
    onSuccess: (updatedJob) => {
      queryClient.setQueryData([...JOB_QUERY_KEY, 'detail', updatedJob.id], updatedJob);
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEY });
    },
  });
}

export function useCancelJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobService.cancel(id),
    onSuccess: (cancelledJob) => {
      queryClient.setQueryData([...JOB_QUERY_KEY, 'detail', cancelledJob.id], cancelledJob);
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEY });
    },
  });
}
