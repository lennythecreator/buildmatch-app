import { apiClient } from '../client';
import type { PresignedUpload, BugReport } from '../types';

export interface PresignInput {
  bucket: string;
  path: string;
}

export interface PublicPresignInput {
  filename: string;
}

export interface CreateBugReportInput {
  title: string;
  description: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  pageUrl?: string;
  userAgent?: string;
  screenshotUrls?: string[];
}

export const uploadService = {
  presign: (input: PresignInput) =>
    apiClient.post<PresignedUpload>('/api/upload/presign', input),

  presignPublic: (input: PublicPresignInput) =>
    apiClient.post<PresignedUpload>('/api/upload/presign-public', input),
};

export const bugReportService = {
  create: (input: CreateBugReportInput) =>
    apiClient.post<BugReport>('/api/bug-reports', input),
};
