import type { Job, UserRoleType } from '@/lib/api/types';

export function normalizeJobsResponse(data: { jobs: Job[] } | Job[] | undefined) {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.jobs ?? [];
}

export function getInvestorEligibleJobs(jobs: Job[]) {
  return jobs;
}

export function getContractorEligibleJobs(jobs: Job[], userId: string) {
  return jobs.filter((job) => job.awardedContractorId === userId && job.status === 'AWARDED');
}

export function getEligibleJobsByRole(
  jobs: Job[],
  role: UserRoleType | undefined,
  userId: string | undefined
) {
  if (!role || !userId) {
    return [];
  }

  if (role === 'INVESTOR') {
    return getInvestorEligibleJobs(jobs);
  }

  if (role === 'CONTRACTOR') {
    return getContractorEligibleJobs(jobs, userId);
  }

  return [];
}
