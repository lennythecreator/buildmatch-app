import { useActiveBids } from '@/hooks/use-active-bids';
import { useMemo } from 'react';

export interface TrackPerformanceData {
  incomeThisMonth: number;
  successScore: number;
}

function isCurrentMonth(date: string | Date) {
  const now = new Date();
  const currentDate = new Date(date);

  return currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear();
}

export function useTrackPerformance() {
  const { data: bids = [], isLoading } = useActiveBids();

  return useMemo(() => {
    const acceptedBids = bids.filter((bid) => bid.status === 'ACCEPTED');
    const pendingBids = bids.filter((bid) => bid.status === 'PENDING');
    const withdrawnBids = bids.filter((bid) => bid.status === 'WITHDRAWN');
    const monthlyAcceptedBids = acceptedBids.filter((bid) => isCurrentMonth(bid.createdAt));
    const incomeThisMonth = monthlyAcceptedBids.reduce((total, bid) => total + bid.amount, 0);
    const successScore = Math.min(
      100,
      Math.max(0, 60 + acceptedBids.length * 15 + pendingBids.length * 2 - withdrawnBids.length * 5)
    );

    return {
      data: {
        incomeThisMonth,
        successScore,
      } satisfies TrackPerformanceData,
      isLoading,
    };
  }, [bids, isLoading]);
}
