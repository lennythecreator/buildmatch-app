import assert from 'node:assert/strict';
import test from 'node:test';

import {
  filterDisputesByTab,
  getDisputePartyIds,
  getScopedDisputes,
  isUserDispute,
} from './dispute-visibility.ts';
import type { Dispute } from '@/lib/api/types';

const baseDispute: Dispute = {
  id: 'dispute-1',
  jobId: 'job-1',
  jobTitle: 'Kitchen remodel',
  filedById: 'user-1',
  againstId: 'user-2',
  milestoneDraw: null,
  amountDisputed: 4500,
  category: 'PAYMENT_ISSUE',
  description: 'Payment was delayed.',
  desiredOutcome: 'Release the funds.',
  status: 'UNDER_REVIEW',
  ruling: null,
  rulingNote: null,
  resolvedAt: null,
  lastActivityAt: '2026-05-22T10:00:00Z',
  createdAt: '2026-05-22T09:00:00Z',
  filedBy: {
    id: 'user-1',
    firstName: 'Ava',
    lastName: 'Stone',
    avatarUrl: null,
    role: 'INVESTOR',
  },
  against: {
    id: 'user-2',
    firstName: 'Marco',
    lastName: 'Lee',
    avatarUrl: null,
    role: 'CONTRACTOR',
  },
  evidenceCount: 1,
  messageCount: 2,
};

test('getDisputePartyIds falls back to nested party objects when top-level ids are missing', () => {
  const dispute = {
    ...baseDispute,
    filedById: undefined,
    againstId: undefined,
  } as unknown as Dispute;

  assert.deepEqual(getDisputePartyIds(dispute), {
    filedById: 'user-1',
    againstId: 'user-2',
  });
});

test('isUserDispute remains true when only nested party ids are present', () => {
  const dispute = {
    ...baseDispute,
    filedById: undefined,
    againstId: undefined,
  } as unknown as Dispute;

  assert.equal(isUserDispute(dispute, 'user-1'), true);
  assert.equal(isUserDispute(dispute, 'user-2'), true);
});

test('getScopedDisputes keeps disputes that only expose nested party ids', () => {
  const visibleDispute = {
    ...baseDispute,
    filedById: undefined,
    againstId: undefined,
  } as unknown as Dispute;
  const hiddenDispute = {
    ...baseDispute,
    id: 'dispute-2',
    filedById: 'other-user',
    againstId: 'another-user',
    filedBy: { ...baseDispute.filedBy, id: 'other-user' },
    against: { ...baseDispute.against, id: 'another-user' },
  };

  const disputes = getScopedDisputes([visibleDispute, hiddenDispute], 'user-1');

  assert.deepEqual(disputes.map((dispute) => dispute.id), ['dispute-1']);
});

test('filterDisputesByTab keeps pending-ruling disputes inside ACTIVE', () => {
  const disputes: Dispute[] = [
    { ...baseDispute, id: 'd-1', status: 'UNDER_REVIEW' },
    { ...baseDispute, id: 'd-2', status: 'PENDING_RULING' },
    { ...baseDispute, id: 'd-3', status: 'RESOLVED' },
  ];

  assert.deepEqual(
    filterDisputesByTab(disputes, 'ACTIVE').map((dispute) => dispute.id),
    ['d-1', 'd-2']
  );
});
