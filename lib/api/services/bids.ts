import { apiClient } from '../client';
import type { Bid, BidListResponse, CreateBidInput } from '../types';

export const bidService = {
  getMyBid: (jobId: string) =>
    apiClient.get<Bid>(`/api/jobs/${jobId}/bids/my-bid`),

  list: (jobId: string) =>
    apiClient.get<BidListResponse>(`/api/jobs/${jobId}/bids`),

  create: (jobId: string, input: CreateBidInput) =>
    apiClient.post<Bid>(`/api/jobs/${jobId}/bids`, input),

  accept: (jobId: string, bidId: string) =>
    apiClient.put<Bid>(`/api/jobs/${jobId}/bids/${bidId}/accept`, {}),

  withdraw: (jobId: string, bidId: string) =>
    apiClient.put<Bid>(`/api/jobs/${jobId}/bids/${bidId}/withdraw`, {}),
};
