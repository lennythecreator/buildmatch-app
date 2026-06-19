import { billingService, CreateBillingMethodInput } from '@/lib/api/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export function useCreateBillingMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBillingMethodInput) =>
      billingService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEY });
    },
  });
}
