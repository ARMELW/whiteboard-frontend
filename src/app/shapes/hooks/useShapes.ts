import { useQuery, useQueryClient } from '@tanstack/react-query';
import shapesService, { ShapeAsset, ListShapesParams } from '../api/shapesService';
import { shapesKeys } from '../config';

export const useShapes = (params?: ListShapesParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: params ? shapesKeys.list(params) : shapesKeys.lists(),
    queryFn: async () => {
      const result = await shapesService.list(params);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (matches backend cache)
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: shapesKeys.lists(),
      refetchType: 'all',
    });
  };

  return {
    shapes: query.data?.data || [],
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    limit: query.data?.limit || 20,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    invalidate,
  };
};

export const useShape = (id: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: shapesKeys.detail(id),
    queryFn: () => shapesService.detail(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: shapesKeys.detail(id),
    });
  };

  return {
    shape: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    invalidate,
  };
};

export default useShapes;
