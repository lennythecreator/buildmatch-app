import type { Dispute } from '@/lib/api/types';
import type { DisputeListResponse } from '@/lib/api/services';
import { logDisputeDebug } from '../debug/dispute-debug.ts';

interface DisputeListItemsResponse {
  items?: Dispute[];
  total?: number;
  page?: number;
  limit?: number;
}

type DisputeListLikeResponse =
  | DisputeListResponse
  | DisputeListItemsResponse
  | Dispute[]
  | undefined;

export function normalizeDisputeListResponse(response: DisputeListLikeResponse): DisputeListResponse {
  if (Array.isArray(response)) {
    logDisputeDebug('normalizeDisputeListResponse.array', {
      count: response.length,
      sampleIds: response.slice(0, 5).map((dispute) => dispute?.id),
    });

    return {
      disputes: response,
      total: response.length,
      page: 1,
      limit: response.length,
    };
  }

  const disputes = response?.disputes ?? response?.items ?? [];

  logDisputeDebug('normalizeDisputeListResponse.object', {
    hasResponse: !!response,
    keys: response ? Object.keys(response) : [],
    hasDisputes: Array.isArray(response?.disputes),
    disputesCount: Array.isArray(response?.disputes) ? response.disputes.length : undefined,
    hasItems: Array.isArray(response?.items),
    itemsCount: Array.isArray(response?.items) ? response.items.length : undefined,
    normalizedCount: disputes.length,
    total: response?.total,
    page: response?.page,
    limit: response?.limit,
    sampleIds: disputes.slice(0, 5).map((dispute) => dispute?.id),
  });

  return {
    disputes,
    total: response?.total ?? disputes.length,
    page: response?.page ?? 1,
    limit: response?.limit ?? disputes.length,
  };
}
