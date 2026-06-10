import { apiClient } from '../client';
import type { Job, JobListResponse, CreateJobInput, JobFilters } from '../types';

export const jobService = {
  list: (filters?: JobFilters) =>
    apiClient.get<JobListResponse>('/api/jobs', { searchParams: filters }),

  get: (id: string) =>
    apiClient.get<Job>(`/api/jobs/${id}`),

  // The backend reads the photo array under `photoUrls` on write but returns it
  // as `photos` on read. Remap here so the rest of the app uses `photos` only.
  create: ({ photos, ...rest }: CreateJobInput) =>
    apiClient.post<Job>('/api/jobs', {
      ...rest,
      ...(photos ? { photoUrls: photos } : {}),
    }),

  update: (id: string, { photos, ...rest }: Partial<CreateJobInput>) =>
    apiClient.put<Job>(`/api/jobs/${id}`, {
      ...rest,
      ...(photos ? { photoUrls: photos } : {}),
    }),

  cancel: (id: string) =>
    apiClient.delete<Job>(`/api/jobs/${id}`),

  getMyJobs: () =>
    apiClient.get<JobListResponse>('/api/jobs/my-jobs'),

  getMyBids: () =>
    apiClient.get<JobListResponse>('/api/jobs/my-bids'),
};
