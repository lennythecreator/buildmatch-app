import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { disputeService } from '@/lib/api/services';
import type { CreateDisputeInput } from '@/lib/api/services';
import { logDisputeDebug } from '@/lib/debug/dispute-debug';
import {
  normalizeDisputeEvidenceResponse,
  normalizeDisputeMessagesResponse,
} from '@/lib/disputes/dispute-detail-response';
import { normalizeDisputeListResponse } from '@/lib/disputes/dispute-list-response';
import {
  filterDisputesByTab,
  getDisputePartyIds,
  getDisputeTabCounts,
  getScopedDisputes,
} from '@/lib/disputes/dispute-visibility';
import { useAuthStore } from '@/store/auth';
import type { Dispute } from '@/lib/api/types';

export const DISPUTE_QUERY_KEY = ['disputes'] as const;
export type { DisputeTabId } from '@/lib/disputes/dispute-visibility';
import type { DisputeTabId } from '@/lib/disputes/dispute-visibility';

export interface DisputeListFilters {
  status?: DisputeTabId;
  page?: number;
  limit?: number;
}

const DISPUTE_PAGE_LIMIT = 25;

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
}

async function getAllDisputes() {
  const disputes: Dispute[] = [];
  let page = 1;
  let total = 0;

  while (true) {
    const rawResponse = await disputeService.list({
      page,
      limit: DISPUTE_PAGE_LIMIT,
    });

    logDisputeDebug('getAllDisputes.rawResponse', {
      page,
      rawType: Array.isArray(rawResponse) ? 'array' : typeof rawResponse,
      keys: rawResponse && typeof rawResponse === 'object' ? Object.keys(rawResponse) : [],
    });

    const response = normalizeDisputeListResponse(rawResponse);

    logDisputeDebug('getAllDisputes.normalizedPage', {
      page,
      pageCount: response.disputes.length,
      total: response.total,
      sample: response.disputes.slice(0, 3).map((dispute) => ({
        id: dispute.id,
        filedById: dispute.filedById,
        againstId: dispute.againstId,
        status: dispute.status,
      })),
    });

    disputes.push(...response.disputes);
    total = response.total;

    if (response.disputes.length < DISPUTE_PAGE_LIMIT || disputes.length >= total) {
      return {
        ...response,
        disputes,
        total,
        page: 1,
        limit: DISPUTE_PAGE_LIMIT,
      };
    }

    page += 1;
  }
}

export function useDisputeSummary() {
  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'summary'],
    queryFn: () => disputeService.getSummary(),
  });
}

export function useDisputes(filters?: DisputeListFilters) {
  const userId = useAuthStore((state) => state.user?.id);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'list', userId, filters],
    queryFn: async () => {
      try {
        const response = await getAllDisputes();

        const scopedDisputes = getScopedDisputes(response.disputes, userId);
        const filteredDisputes = filterDisputesByTab(scopedDisputes, filters?.status);

        logDisputeDebug('useDisputes.queryFn', {
          userId,
          filters,
          apiTotal: response.total,
          apiCount: response.disputes.length,
          apiDisputeIds: response.disputes.map((dispute) => dispute.id),
          scopedCount: scopedDisputes.length,
          scopedDisputeIds: scopedDisputes.map((dispute) => dispute.id),
          unmatchedSample: response.disputes
            .filter((dispute) => {
              const partyIds = getDisputePartyIds(dispute);
              return partyIds.filedById !== userId && partyIds.againstId !== userId;
            })
            .slice(0, 3)
            .map((dispute) => ({
              id: dispute.id,
              ...getDisputePartyIds(dispute),
              filedByUserId: dispute.filedBy?.id,
              againstUserId: dispute.against?.id,
            })),
          filteredCount: filteredDisputes.length,
          filteredDisputeIds: filteredDisputes.map((dispute) => dispute.id),
        });

        return {
          ...response,
          disputes: filteredDisputes,
          total: filteredDisputes.length,
        };
      } catch (error) {
        logDisputeDebug('useDisputes.queryFn.error', {
          userId,
          filters,
          error: serializeError(error),
        });
        throw error;
      }
    },
    enabled: isAuthenticated && !isLoading,
  });
}

export function useDisputeTabCounts() {
  const userId = useAuthStore((state) => state.user?.id);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'tab-counts', userId],
    queryFn: async () => {
      try {
        const response = await getAllDisputes();
        const scopedDisputes = getScopedDisputes(response.disputes, userId);
        const counts = getDisputeTabCounts(scopedDisputes);

        logDisputeDebug('useDisputeTabCounts.queryFn', {
          userId,
          apiCount: response.disputes.length,
          scopedCount: scopedDisputes.length,
          counts,
        });

        return counts;
      } catch (error) {
        logDisputeDebug('useDisputeTabCounts.queryFn.error', {
          userId,
          error: serializeError(error),
        });
        throw error;
      }
    },
    enabled: isAuthenticated && !isLoading,
  });
}

export function useDispute(id: string) {
  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'detail', id],
    queryFn: () => disputeService.get(id),
    enabled: !!id,
  });
}

export function useDisputeMessages(id: string) {
  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'detail', id, 'messages'],
    queryFn: async () => {
      const response = await disputeService.getMessages(id);
      return normalizeDisputeMessagesResponse(response);
    },
    enabled: !!id,
    refetchInterval: 10000,
  });
}

export function useDisputeEvidence(id: string) {
  return useQuery({
    queryKey: [...DISPUTE_QUERY_KEY, 'detail', id, 'evidence'],
    queryFn: async () => {
      const response = await disputeService.getEvidence(id);
      return normalizeDisputeEvidenceResponse(response);
    },
    enabled: !!id,
  });
}

export function useCreateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDisputeInput) => disputeService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISPUTE_QUERY_KEY });
    },
  });
}

export function useAddDisputeMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, content }: { disputeId: string; content: string }) =>
      disputeService.addMessage(disputeId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DISPUTE_QUERY_KEY, 'detail', variables.disputeId, 'messages'],
      });
    },
  });
}

export function useAddDisputeEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      disputeId,
      type,
      url,
      description,
    }: {
      disputeId: string;
      type: string;
      url: string;
      description?: string;
    }) => disputeService.addEvidence(disputeId, type, url, description),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...DISPUTE_QUERY_KEY, 'detail', variables.disputeId, 'evidence'],
      });
    },
  });
}

export function useWithdrawDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, reason }: { disputeId: string; reason: string }) =>
      disputeService.withdraw(disputeId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISPUTE_QUERY_KEY });
    },
  });
}
