import { useQuery, useQueryClient } from '@tanstack/react-query';
import assetsService, { Asset, UploadAssetData } from '../api/assetsService';
import { assetsKeys } from '../config';

export const useAssets = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: assetsKeys.lists(),
    queryFn: async () => {
      const result = await assetsService.list({ page: 1, limit: 1000 });
      return result.data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: assetsKeys.lists(),
      refetchType: 'all',
    });
  };

  return {
    assets: query.data || [],
    loading: query.isLoading,
    error: query.error,
    loadAssets: query.refetch,
    invalidate,
  };
};

export default useAssets;
