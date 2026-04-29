import { apiClient } from '../client';
import type { DrawSchedule, DrawMilestone, DrawRequest, DrawEvidence } from '../types';

export interface CreateMilestoneInput {
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
}

export interface UpdateMilestoneInput {
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: string;
}

export const drawService = {
  getSchedule: (jobId: string) =>
    apiClient.get<DrawSchedule>(`/api/jobs/${jobId}/draws`),

  generateSchedule: (jobId: string) =>
    apiClient.post<DrawSchedule>(`/api/jobs/${jobId}/draws/generate`, {}),

  approveSchedule: (jobId: string) =>
    apiClient.post<DrawSchedule>(`/api/jobs/${jobId}/draws/approve`, {}),

  resetApproval: (jobId: string) =>
    apiClient.post<DrawSchedule>(`/api/jobs/${jobId}/draws/reset-approval`, {}),

  addMilestone: (jobId: string, input: CreateMilestoneInput) =>
    apiClient.post<DrawMilestone>(`/api/jobs/${jobId}/draws/milestones`, input),

  updateMilestone: (jobId: string, milestoneId: string, input: UpdateMilestoneInput) =>
    apiClient.put<DrawMilestone>(`/api/jobs/${jobId}/draws/milestones/${milestoneId}`, input),

  deleteMilestone: (jobId: string, milestoneId: string) =>
    apiClient.delete<void>(`/api/jobs/${jobId}/draws/milestones/${milestoneId}`),

  requestDraw: (jobId: string, milestoneId: string) =>
    apiClient.post<DrawRequest>(`/api/jobs/${jobId}/draws/milestones/${milestoneId}/request`, {}),

  getRequest: (jobId: string, milestoneId: string) =>
    apiClient.get<DrawRequest>(`/api/jobs/${jobId}/draws/milestones/${milestoneId}/request`),

  approveRequest: (jobId: string, requestId: string) =>
    apiClient.post<DrawRequest>(`/api/jobs/${jobId}/draws/requests/${requestId}/approve`, {}),

  disputeRequest: (jobId: string, requestId: string) =>
    apiClient.post<DrawRequest>(`/api/jobs/${jobId}/draws/requests/${requestId}/dispute`, {}),

  addEvidence: (jobId: string, requestId: string, url: string, description?: string) =>
    apiClient.post<DrawEvidence>(`/api/jobs/${jobId}/draws/requests/${requestId}/evidence`, {
      url,
      description,
    }),
};
