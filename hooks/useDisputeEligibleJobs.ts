import { useMemo } from 'react';
import { logDisputeDebug } from '@/lib/debug/dispute-debug';
import type { Job, UserRoleType } from '@/lib/api/types';
import { getEligibleJobsByRole, normalizeJobsResponse } from '@/lib/disputes/dispute-eligible-jobs';
import { useAuthStore } from '@/store/auth';
import { useMyBids, useMyJobs } from './useJobs';

interface UseDisputeEligibleJobsResult {
  eligibleJobs: Job[];
  isLoading: boolean;
}

export function useDisputeEligibleJobs(): UseDisputeEligibleJobsResult {
  const userId = useAuthStore((state) => state.user?.id);
  const role = useAuthStore((state) => state.user?.role);

  const investorJobsQuery = useMyJobs({ enabled: role === 'INVESTOR' });
  const contractorJobsQuery = useMyBids({ enabled: role === 'CONTRACTOR' });

  const sourceJobs = useMemo(() => {
    if (role === 'INVESTOR') {
      return normalizeJobsResponse(investorJobsQuery.data);
    }

    if (role === 'CONTRACTOR') {
      return normalizeJobsResponse(contractorJobsQuery.data);
    }

    return [];
  }, [contractorJobsQuery.data, investorJobsQuery.data, role]);

  const eligibleJobs = getEligibleJobsByRole(sourceJobs, role, userId);

  logDisputeDebug('useDisputeEligibleJobs', {
    userId,
    role,
    investorJobsCount: normalizeJobsResponse(investorJobsQuery.data).length,
    investorJobIds: normalizeJobsResponse(investorJobsQuery.data).map((job) => job.id),
    contractorJobsCount: normalizeJobsResponse(contractorJobsQuery.data).length,
    contractorJobIds: normalizeJobsResponse(contractorJobsQuery.data).map((job) => job.id),
    sourceJobsCount: sourceJobs.length,
    sourceJobIds: sourceJobs.map((job) => job.id),
    eligibleJobsCount: eligibleJobs.length,
    eligibleJobIds: eligibleJobs.map((job) => job.id),
    investorJobsError: investorJobsQuery.error,
    contractorJobsError: contractorJobsQuery.error,
  });

  return {
    eligibleJobs,
    isLoading:
      role === 'INVESTOR'
        ? investorJobsQuery.isLoading
        : role === 'CONTRACTOR'
          ? contractorJobsQuery.isLoading
          : false,
  };
}
