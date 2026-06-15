import { billingService } from '@/lib/api/services';
import { useQuery } from '@tanstack/react-query';

export const BILLING_QUERY_KEY = ['billing-methods'] as const;

interface BillingQueryOptions {
  enabled?: boolean;
}

export function useBillingMethods(options?: BillingQueryOptions) {
  return useQuery({
    queryKey: BILLING_QUERY_KEY,
    queryFn: () => billingService.list(),
    enabled: options?.enabled ?? true,
  });
}
