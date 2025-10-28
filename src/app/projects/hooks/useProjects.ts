import { useEffect, useCallback } from 'react';
import { useProjectStore } from '../store';
import { projectService } from '../api/projectService';

export const useProjects = (channelId?: string) => {
  const projects = useProjectStore((state) => state.projects);
  const loading = useProjectStore((state) => state.loading);
  const error = useProjectStore((state) => state.error);
  const setProjects = useProjectStore((state) => state.setProjects);

  const setLoading = useCallback(
    (v: boolean) => useProjectStore.setState({ loading: v }),
    []
  );
  const setError = useCallback(
    (e: Error | null) => useProjectStore.setState({ error: e }),
    []
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      result = await projectService.list(channelId || '');

      console.log('Fetched projects:', result.data);
      setProjects(result.data.projects);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [channelId, setLoading, setError, setProjects]);

  useEffect(() => {
    refetch();
  }, [channelId]);

  return {
    projects,
    loading,
    error,
    refetch,
  };
};
