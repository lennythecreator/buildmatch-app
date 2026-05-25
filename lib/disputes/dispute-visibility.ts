import type { Dispute, DisputeStatus } from '@/lib/api/types';

export type DisputeTabId =
  | 'ALL'
  | 'ACTIVE'
  | 'UNDER_REVIEW'
  | 'AWAITING_EVIDENCE'
  | 'RESOLVED'
  | 'WITHDRAWN';

const ACTIVE_STATUSES: DisputeStatus[] = ['UNDER_REVIEW', 'AWAITING_EVIDENCE', 'PENDING_RULING'];

interface DisputePartyIds {
  filedById?: string;
  againstId?: string;
}

export function getDisputePartyIds(dispute: Partial<Dispute>): DisputePartyIds {
  return {
    filedById: dispute.filedById ?? dispute.filedBy?.id,
    againstId: dispute.againstId ?? dispute.against?.id,
  };
}

export function isUserDispute(dispute: Partial<Dispute>, userId: string) {
  const { filedById, againstId } = getDisputePartyIds(dispute);
  return filedById === userId || againstId === userId;
}

export function getScopedDisputes(disputes: Dispute[], userId?: string) {
  if (!userId) {
    return [];
  }

  return disputes.filter((dispute) => isUserDispute(dispute, userId));
}

export function filterDisputesByTab(disputes: Dispute[], status?: DisputeTabId) {
  if (!status || status === 'ALL') {
    return disputes;
  }

  if (status === 'ACTIVE') {
    return disputes.filter((dispute) => ACTIVE_STATUSES.includes(dispute.status));
  }

  return disputes.filter((dispute) => dispute.status === status);
}

export function getDisputeTabCounts(disputes: Dispute[]) {
  const activeCount = disputes.filter((dispute) => ACTIVE_STATUSES.includes(dispute.status)).length;

  return {
    ALL: disputes.length,
    ACTIVE: activeCount,
    UNDER_REVIEW: disputes.filter((dispute) => dispute.status === 'UNDER_REVIEW').length,
    AWAITING_EVIDENCE: disputes.filter((dispute) => dispute.status === 'AWAITING_EVIDENCE').length,
    RESOLVED: disputes.filter((dispute) => dispute.status === 'RESOLVED').length,
    WITHDRAWN: disputes.filter((dispute) => dispute.status === 'WITHDRAWN').length,
  };
}
