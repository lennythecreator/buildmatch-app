import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractorService } from '@/lib/api/services';
import type { ContractorFilters } from '@/lib/api/types';

export const CONTRACTOR_QUERY_KEY = ['contractors'] as const;

export function useContractors(filters?: ContractorFilters) {
  return useQuery({
    queryKey: [...CONTRACTOR_QUERY_KEY, 'list', filters],
    queryFn: () => contractorService.list(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}

export function useContractor(id: string) {
  return useQuery({
    queryKey: [...CONTRACTOR_QUERY_KEY, 'detail', id],
    queryFn: () => contractorService.get(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}

export function useMyContractorProfile() {
  return useQuery({
    queryKey: [...CONTRACTOR_QUERY_KEY, 'me'],
    queryFn: () => contractorService.getMe(),
  });
}

export function useUpdateContractorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof contractorService.updateMe>[0]) =>
      contractorService.updateMe(input),
    onSuccess: (data) => {
      queryClient.setQueryData([...CONTRACTOR_QUERY_KEY, 'me'], data);
    },
  });
}
