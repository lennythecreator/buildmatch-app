import { mockBids } from '@/data/mock-bids';
import { Bid } from '@/types/bid';
import { useEffect, useState } from 'react';

export function useActiveBids(contractorId?: string) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchBids = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!isMounted) return;
        
        // Active bids are those that are still pending or have been accepted
        // (but presumably haven't finished). 
        const activeBids = mockBids.filter(bid => {
          const isUserMatch = contractorId ? bid.contractorId === contractorId : true;
          const isActive = bid.status === 'PENDING' || bid.status === 'ACCEPTED';
          return isUserMatch && isActive;
        });

        setBids(activeBids);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch active bids'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBids();

    return () => {
      isMounted = false;
    };
  }, [contractorId]);

  return { bids, isLoading, error };
}
