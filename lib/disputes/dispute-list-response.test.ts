import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeDisputeListResponse } from './dispute-list-response.ts';
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

test('normalizeDisputeListResponse supports raw array responses', () => {
  const disputes = [baseDispute];

  assert.deepEqual(normalizeDisputeListResponse(disputes), {
    disputes,
    total: 1,
    page: 1,
    limit: 1,
  });
});

test('normalizeDisputeListResponse supports object responses with disputes', () => {
  const disputes = [baseDispute];

  assert.deepEqual(normalizeDisputeListResponse({ disputes, total: 9, page: 2, limit: 5 }), {
    disputes,
    total: 9,
    page: 2,
    limit: 5,
  });
});

test('normalizeDisputeListResponse supports paginated object responses with items', () => {
  const disputes = [baseDispute];

  assert.deepEqual(normalizeDisputeListResponse({ items: disputes, total: 3, page: 1, limit: 25 }), {
    disputes,
    total: 3,
    page: 1,
    limit: 25,
  });
});
