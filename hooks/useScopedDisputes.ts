import { useMemo } from 'react';
import { useAuthStore } from '@/store/auth';
import type { Dispute } from '@/lib/api/types';
import { filterDisputesByTab, type DisputeTabId } from '@/lib/disputes/dispute-visibility';
import { useDisputes } from './useDisputes';

export type ScopedDisputeTabId = DisputeTabId;

export function useScopedDisputes(activeTab: ScopedDisputeTabId) {
  const userId = useAuthStore((state) => state.user?.id);
  const disputesQuery = useDisputes({ status: activeTab, limit: 1000 });

  const disputes = useMemo(() => {
    if (!userId) {
      return [];
    }

    return filterDisputesByTab(disputesQuery.data?.disputes ?? [], activeTab);
  }, [activeTab, disputesQuery.data?.disputes, userId]);

  return {
    ...disputesQuery,
    disputes,
  };
}
