import { apiClient } from '../client';
import type { Contract } from '../types';

export interface GenerateContractInput {
  jobId: string;
  bidId: string;
}

export const contractService = {
  getByJob: (jobId: string) =>
    apiClient.get<Contract>(`/api/contracts/by-job/${jobId}`),

  generate: (input: GenerateContractInput) =>
    apiClient.post<Contract>('/api/contracts/generate', input),

  get: (contractId: string) =>
    apiClient.get<Contract>(`/api/contracts/${contractId}`),

  sign: (contractId: string) =>
    apiClient.post<Contract>(`/api/contracts/${contractId}/sign`, {}),

  getPdf: (contractId: string) =>
    apiClient.get<Blob>(`/api/contracts/${contractId}/pdf`),
};
