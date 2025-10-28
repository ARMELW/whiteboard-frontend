import { useQuery, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../api/projectService';
import { projectsKeys } from '../config';

export const useProjects = (channelId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: channelId 
      ? projectsKeys.list({ channelId })
      : projectsKeys.lists(),
    queryFn: async () => {
      const result = await projectService.list(channelId || '');
      return result.data.projects;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: projectsKeys.lists(),
      refetchType: 'all',
    });
  };

  return {
    projects: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    invalidate,
  };
};
