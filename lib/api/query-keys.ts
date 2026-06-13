export const QUERY_KEYS = {
  BIDS: ['bids'] as const,
  BIDS_JOB: (jobId: string) => ['bids', 'job', jobId] as const,
  BIDS_MY_BID: (jobId: string) => ['bids', 'my-bid', jobId] as const,
  JOBS: ['jobs'] as const,
  JOBS_LIST: (filters?: Record<string, unknown>) => ['jobs', 'list', filters] as const,
  JOBS_DETAIL: (id: string) => ['jobs', 'detail', id] as const,
  JOBS_MY_JOBS: ['jobs', 'my-jobs'] as const,
  JOBS_MY_BIDS: ['jobs', 'my-bids'] as const,
  CONTRACTOR_BIDS: (contractorId?: string) => ['contractor', 'bids', contractorId ?? 'me'] as const,
} as const;
