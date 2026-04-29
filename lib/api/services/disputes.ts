import { apiClient } from '../client';
import type {
  Dispute,
  DisputeMessage,
  DisputeEvidence,
  DisputeSummary,
  DisputeCategory,
} from '../types';

export interface CreateDisputeInput {
  jobId: string;
  category: DisputeCategory;
  amountDisputed: number;
  description: string;
  desiredOutcome: string;
}

export interface DisputeFilters {
  status?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface DisputeListResponse {
  disputes: Dispute[];
  total: number;
  page: number;
  limit: number;
}

export const disputeService = {
  getSummary: () =>
    apiClient.get<DisputeSummary>('/api/disputes/summary'),

  list: (filters?: DisputeFilters) =>
    apiClient.get<DisputeListResponse>('/api/disputes', { searchParams: filters }),

  create: (input: CreateDisputeInput) =>
    apiClient.post<Dispute>('/api/disputes', input),

  get: (id: string) =>
    apiClient.get<Dispute>(`/api/disputes/${id}`),

  getMessages: (id: string) =>
    apiClient.get<DisputeMessage[]>(`/api/disputes/${id}/messages`),

  addMessage: (id: string, content: string) =>
    apiClient.post<DisputeMessage>(`/api/disputes/${id}/messages`, { content }),

  getEvidence: (id: string) =>
    apiClient.get<DisputeEvidence[]>(`/api/disputes/${id}/evidence`),

  addEvidence: (id: string, type: string, url: string, description?: string) =>
    apiClient.post<DisputeEvidence>(`/api/disputes/${id}/evidence`, {
      type,
      url,
      description,
    }),

  withdraw: (id: string, reason: string) =>
    apiClient.post<Dispute>(`/api/disputes/${id}/withdraw`, { reason }),
};
