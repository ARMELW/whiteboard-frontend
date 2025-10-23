import { useEffect, useCallback } from 'react';
import { useSceneStore } from '../store';
import scenesService from '../api/scenesService';

export const useScenes = () => {
  const scenes = useSceneStore((state) => state.scenes);
  const loading = useSceneStore((state) => state.loading);
  const error = useSceneStore((state) => state.error);
  const setScenes = useSceneStore((state) => state.setScenes);

  // Use store.setState directly to avoid new function identity on every render
  const setLoading = useCallback((v: boolean) => useSceneStore.setState({ loading: v }), []);
  const setError = useCallback((e: Error | null) => useSceneStore.setState({ error: e }), []);

  // Load scenes on mount if not already loaded
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await scenesService.list({ page: 1, limit: 1000 });
      setScenes(result.data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setScenes]);

  useEffect(() => {
    if (scenes.length === 0 && !loading) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    scenes,
    loading,
    error,
    refetch,
  };
};
