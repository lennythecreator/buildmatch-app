import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { estimatorService } from '@/lib/api/services';
import type { CreatePropertyInput, CreateEstimateInput } from '@/lib/api/services';

export const ESTIMATOR_QUERY_KEY = ['estimator'] as const;

export function useProperties() {
  return useQuery({
    queryKey: [...ESTIMATOR_QUERY_KEY, 'properties'],
    queryFn: () => estimatorService.getProperties(),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: [...ESTIMATOR_QUERY_KEY, 'properties', id],
    queryFn: () => estimatorService.getProperty(id),
    enabled: !!id,
  });
}

export function usePropertyEstimates(propertyId: string) {
  return useQuery({
    queryKey: [...ESTIMATOR_QUERY_KEY, 'properties', propertyId, 'estimates'],
    queryFn: () => estimatorService.getPropertyEstimates(propertyId),
    enabled: !!propertyId,
  });
}

export function useEstimate(id: string) {
  return useQuery({
    queryKey: [...ESTIMATOR_QUERY_KEY, 'estimates', id],
    queryFn: () => estimatorService.getEstimate(id),
    enabled: !!id,
  });
}

export function usePollEstimate(id: string) {
  return useQuery({
    queryKey: [...ESTIMATOR_QUERY_KEY, 'estimates', id, 'poll'],
    queryFn: () => estimatorService.pollEstimate(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'PROCESSING') {
        return 5000;
      }
      return false;
    },
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePropertyInput) => estimatorService.createProperty(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ESTIMATOR_QUERY_KEY, 'properties'] });
    },
  });
}

export function useCreateEstimate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEstimateInput) => estimatorService.createEstimate(input),
    onSuccess: (data) => {
      queryClient.setQueryData([...ESTIMATOR_QUERY_KEY, 'estimates', data.estimateId, 'poll'], {
        status: data.status,
      });
    },
  });
}

export function useUploadEstimatePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      propertyId,
      photo,
    }: {
      propertyId: string;
      photo: Parameters<typeof estimatorService.uploadPhoto>[1];
    }) => estimatorService.uploadPhoto(propertyId, photo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...ESTIMATOR_QUERY_KEY, 'properties', variables.propertyId],
      });
    },
  });
}

export function useDeleteEstimatePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, photoId }: { propertyId: string; photoId: string }) =>
      estimatorService.deletePhoto(photoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...ESTIMATOR_QUERY_KEY, 'properties', variables.propertyId],
      });
    },
  });
}
