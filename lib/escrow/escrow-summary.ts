import type { Bid, EscrowMilestone, EscrowPayment, EscrowPaymentStatus } from '@/lib/api/types';

export type { EscrowPaymentStatus };

export const ESCROW_FEE_RATE = 0.02;

export interface EscrowSummary {
  contractorName: string;
  investorName: string;
  bidAmount: number;
  escrowFee: number;
  orderTotal: number;
  feeRate: number;
  milestones: EscrowMilestone[];
}

export function formatEscrowCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function joinName(firstName?: string, lastName?: string, fallback = ''): string {
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  return name.length > 0 ? name : fallback;
}

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

interface BuildEscrowSummaryOptions {
  investorName?: string;
}

export function buildEscrowSummary(
  bid: Bid,
  payment: EscrowPayment | null | undefined,
  options?: BuildEscrowSummaryOptions
): EscrowSummary {
  const bidAmount = bid.amount;
  const escrowFee = roundToCents(bidAmount * ESCROW_FEE_RATE);
  const milestones = [...(payment?.milestones ?? [])].sort((a, b) => a.order - b.order);

  return {
    contractorName: joinName(bid.contractor?.firstName, bid.contractor?.lastName, 'Contractor'),
    investorName: options?.investorName?.trim() || 'Client',
    bidAmount,
    escrowFee,
    orderTotal: roundToCents(bidAmount + escrowFee),
    feeRate: ESCROW_FEE_RATE,
    milestones,
  };
}

export function getPaymentStatusLabel(status: EscrowPaymentStatus): string {
  const labels: Record<EscrowPaymentStatus, string> = {
    PENDING: 'Pending Funding',
    FUNDED: 'Funded',
    IN_PROGRESS: 'In Progress',
    FULLY_RELEASED: 'Completed',
    DISPUTED: 'Disputed',
    REFUNDED: 'Refunded',
  };
  return labels[status];
}

export function getMilestoneStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    SUBMITTED: 'Submitted',
    APPROVED: 'Approved',
    DISPUTED: 'Disputed',
    RELEASED: 'Released',
  };
  return labels[status] ?? status;
}
