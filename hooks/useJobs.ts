import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/lib/api/services';
import type { Job, JobFilters, CreateJobInput } from '@/lib/api/types';

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
  return useQuery({
    queryKey: [...JOB_QUERY_KEY, 'my-jobs'],
    queryFn: () => jobService.getMyJobs(),
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
