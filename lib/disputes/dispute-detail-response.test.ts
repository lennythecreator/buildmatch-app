import assert from 'node:assert/strict';
import test from 'node:test';

import type { DisputeEvidence, DisputeMessage } from '@/lib/api/types';
import {
  normalizeDisputeEvidenceResponse,
  normalizeDisputeMessagesResponse,
} from './dispute-detail-response.ts';

const baseEvidence: DisputeEvidence = {
  id: 'evidence-1',
  disputeId: 'dispute-1',
  type: 'image/jpeg',
  url: 'https://example.com/evidence.jpg',
  description: 'Site photo',
  uploadedById: 'user-1',
  createdAt: '2026-05-22T09:00:00Z',
};

const baseMessage: DisputeMessage = {
  id: 'message-1',
  disputeId: 'dispute-1',
  senderId: 'user-1',
  content: 'Please review the attached photo.',
  createdAt: '2026-05-22T09:30:00Z',
  sender: {
    firstName: 'Ava',
    lastName: 'Stone',
    avatarUrl: null,
  },
};

test('normalizeDisputeEvidenceResponse supports raw array responses', () => {
  const evidence = [baseEvidence];

  assert.deepEqual(normalizeDisputeEvidenceResponse(evidence), evidence);
});

test('normalizeDisputeEvidenceResponse supports object responses with evidence', () => {
  const evidence = [baseEvidence];

  assert.deepEqual(normalizeDisputeEvidenceResponse({ evidence }), evidence);
});

test('normalizeDisputeEvidenceResponse supports paginated object responses with items', () => {
  const evidence = [baseEvidence];

  assert.deepEqual(normalizeDisputeEvidenceResponse({ items: evidence }), evidence);
});

test('normalizeDisputeMessagesResponse supports raw array responses', () => {
  const messages = [baseMessage];

  assert.deepEqual(normalizeDisputeMessagesResponse(messages), messages);
});

test('normalizeDisputeMessagesResponse supports object responses with messages', () => {
  const messages = [baseMessage];

  assert.deepEqual(normalizeDisputeMessagesResponse({ messages }), messages);
});

test('normalizeDisputeMessagesResponse supports paginated object responses with items', () => {
  const messages = [baseMessage];

  assert.deepEqual(normalizeDisputeMessagesResponse({ items: messages }), messages);
});
