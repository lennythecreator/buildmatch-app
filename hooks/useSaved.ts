import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { savedService } from "@/lib/api/services";

export const SAVED_QUERY_KEY = ["saved"] as const;

export function useSavedContractorIds() {
  return useQuery({
    queryKey: [...SAVED_QUERY_KEY, "ids"],
    queryFn: () => savedService.getIds(),
  });
}

export function useToggleSavedContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractorProfileId: string) => savedService.toggle(contractorProfileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...SAVED_QUERY_KEY, "ids"] });
      queryClient.invalidateQueries({ queryKey: [...SAVED_QUERY_KEY, "lists"] });
    },
  });
}