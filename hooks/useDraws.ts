import { drawService } from '@/lib/api/services';
import { useQuery } from '@tanstack/react-query';

export const DRAW_QUERY_KEY = ['draws'] as const;

interface DrawQueryOptions {
  enabled?: boolean;
}

export function useDrawSchedule(jobId: string, options?: DrawQueryOptions) {
  return useQuery({
    queryKey: [...DRAW_QUERY_KEY, 'schedule', jobId],
    queryFn: () => drawService.getSchedule(jobId),
    enabled: (options?.enabled ?? true) && !!jobId,
    // A job without an approved schedule yet returns an error; treat that as an
    // empty schedule in the UI rather than retrying.
    retry: false,
  });
}
