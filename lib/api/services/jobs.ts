import { apiClient } from '../client';
import type { Job, JobListResponse, CreateJobInput, JobFilters } from '../types';

export const jobService = {
  list: (filters?: JobFilters) =>
    apiClient.get<JobListResponse>('/api/jobs', { searchParams: filters }),

  get: (id: string) =>
    apiClient.get<Job>(`/api/jobs/${id}`),

  create: (input: CreateJobInput) =>
    apiClient.post<Job>('/api/jobs', input),

  update: (id: string, input: Partial<CreateJobInput>) =>
    apiClient.put<Job>(`/api/jobs/${id}`, input),

  cancel: (id: string) =>
    apiClient.delete<Job>(`/api/jobs/${id}`),

  getMyJobs: () =>
    apiClient.get<JobListResponse>('/api/jobs/my-jobs'),

  getMyBids: () =>
    apiClient.get<JobListResponse>('/api/jobs/my-bids'),
};
