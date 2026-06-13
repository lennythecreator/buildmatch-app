import { QUERY_KEYS } from '@/lib/api/query-keys';
import { jobService } from '@/lib/api/services';
import type { CreateJobInput, JobFilters } from '@/lib/api/types';
import { useAuthStore } from '@/store/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface UserJobsQueryOptions {
  enabled?: boolean;
}

export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.JOBS_LIST(filters),
    queryFn: () => jobService.list(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.JOBS_DETAIL(id),
    queryFn: () => jobService.get(id),
    enabled: !!id,
  });
}

export function useMyJobs(options?: UserJobsQueryOptions) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: QUERY_KEYS.JOBS_MY_JOBS,
    queryFn: () => jobService.getMyJobs(),
    enabled: (options?.enabled ?? true) && isAuthenticated && !isLoading,
  });
}

export function useMyBids(options?: UserJobsQueryOptions) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: QUERY_KEYS.JOBS_MY_BIDS,
    queryFn: () => jobService.getMyBids(),
    enabled: (options?.enabled ?? true) && isAuthenticated && !isLoading,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateJobInput) => jobService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS_MY_JOBS });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateJobInput> }) =>
      jobService.update(id, input),
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(QUERY_KEYS.JOBS_DETAIL(updatedJob.id), updatedJob);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS });
    },
  });
}

export function useCancelJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobService.cancel(id),
    onSuccess: (cancelledJob) => {
      queryClient.setQueryData(QUERY_KEYS.JOBS_DETAIL(cancelledJob.id), cancelledJob);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS });
    },
  });
}
