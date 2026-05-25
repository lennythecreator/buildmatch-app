import test from 'node:test';
import assert from 'node:assert/strict';
import { getEligibleJobsByRole, normalizeJobsResponse } from './dispute-eligible-jobs.ts';
import type { Job } from '@/lib/api/types';

function createJob(overrides: Partial<Job>): Job {
  return {
    id: 'job-1',
    title: 'Kitchen remodel',
    description: 'Full kitchen renovation',
    tradeType: 'GENERAL',
    budgetMin: 10000,
    budgetMax: 20000,
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30301',
    status: 'OPEN',
    postedById: 'investor-1',
    createdAt: '2026-05-22T00:00:00.000Z',
    updatedAt: '2026-05-22T00:00:00.000Z',
    ...overrides,
  };
}

test('normalizeJobsResponse supports raw array responses', () => {
  const jobs = [createJob({ id: 'job-array-1' })];

  assert.deepEqual(normalizeJobsResponse(jobs), jobs);
});

test('normalizeJobsResponse supports object responses', () => {
  const jobs = [createJob({ id: 'job-object-1' })];

  assert.deepEqual(normalizeJobsResponse({ jobs }), jobs);
});

test('investors see all jobs returned by my-jobs', () => {
  const jobs = [
    createJob({ id: 'job-owned', postedById: 'investor-1' }),
    createJob({ id: 'job-other', postedById: 'investor-2' }),
  ];

  const eligibleJobs = getEligibleJobsByRole(jobs, 'INVESTOR', 'investor-1');

  assert.deepEqual(
    eligibleJobs.map((job) => job.id),
    ['job-owned', 'job-other']
  );
});

test('contractors see only awarded jobs tied to them', () => {
  const jobs = [
    createJob({ id: 'job-awarded', status: 'AWARDED', awardedContractorId: 'contractor-1' }),
    createJob({ id: 'job-open', status: 'OPEN', awardedContractorId: 'contractor-1' }),
    createJob({ id: 'job-other-contractor', status: 'AWARDED', awardedContractorId: 'contractor-2' }),
  ];

  const eligibleJobs = getEligibleJobsByRole(jobs, 'CONTRACTOR', 'contractor-1');

  assert.deepEqual(
    eligibleJobs.map((job) => job.id),
    ['job-awarded']
  );
});
