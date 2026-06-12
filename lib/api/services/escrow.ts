import { apiClient } from '../client';
import type {
  EscrowOnboardStatus,
  EscrowPayment,
  FundJobInput,
  FundJobResponse,
  EscrowOnboardResponse,
  MilestoneActionResponse,
  SubmitMilestoneInput,
  DisputeMilestoneInput,
} from '../types';

export const escrowService = {
  onboard: () =>
    apiClient.post<EscrowOnboardResponse>('/api/escrow/onboard', {}),

  getOnboardStatus: () =>
    apiClient.get<EscrowOnboardStatus>('/api/escrow/onboard/status'),

  fundJob: (jobId: string, input: FundJobInput) =>
    apiClient.post<FundJobResponse>(`/api/escrow/fund-job/${jobId}`, input),

  getByJob: (jobId: string) =>
    apiClient.get<EscrowPayment>(`/api/escrow/${jobId}`),

  submitMilestone: (jobId: string, milestoneId: string, input?: SubmitMilestoneInput) =>
    apiClient.post<MilestoneActionResponse>(
      `/api/escrow/${jobId}/milestones/${milestoneId}/submit`,
      input ?? {}
    ),

  approveMilestone: (jobId: string, milestoneId: string) =>
    apiClient.post<MilestoneActionResponse>(
      `/api/escrow/${jobId}/milestones/${milestoneId}/approve`,
      {}
    ),

  disputeMilestone: (jobId: string, milestoneId: string, input: DisputeMilestoneInput) =>
    apiClient.post<MilestoneActionResponse>(
      `/api/escrow/${jobId}/milestones/${milestoneId}/dispute`,
      input
    ),
};
