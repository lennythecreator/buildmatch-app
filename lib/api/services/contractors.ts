import { apiClient } from '../client';
import type {
  ContractorProfile,
  ContractorListResponse,
  ContractorFilters,
} from '../types';

export interface UpdateContractorProfileInput {
  bio?: string;
  yearsExperience?: number;
  specialties?: string[];
  city?: string;
  state?: string;
  isAvailable?: boolean;
}

export const contractorService = {
  list: (filters?: ContractorFilters) =>
    apiClient.get<ContractorListResponse>('/api/contractors', { searchParams: filters }),

  get: (id: string) =>
    apiClient.get<ContractorProfile>(`/api/contractors/${id}`),

  getMe: () =>
    apiClient.get<ContractorProfile>('/api/contractors/me'),

  updateMe: (input: UpdateContractorProfileInput) =>
    apiClient.put<ContractorProfile>('/api/contractors/me', input),
};
