import { useQuery, useQueryClient } from '@tanstack/react-query';
import scenesService from '../api/scenesService';
import { scenesKeys } from '../config';

export const useScenes = (projectId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: projectId 
      ? scenesKeys.list({ projectId })
      : scenesKeys.lists(),
    queryFn: async () => {
      const result = await scenesService.list({ page: 1, limit: 1000 });
      const scenes = result.data;
      
      // Filter by projectId if provided
      if (projectId) {
        return scenes.filter(s => s.projectId === projectId);
      }
      return scenes;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: scenesKeys.lists(),
      refetchType: 'all',
    });
  };

  return {
    scenes: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    invalidate,
  };
};
