import { useEffect } from 'react';
import { useSceneStore } from '../store';

export const useScenes = () => {
  const scenes = useSceneStore((state) => state.scenes);
  const loading = useSceneStore((state) => state.loading);
  const error = useSceneStore((state) => state.error);
  const loadScenes = useSceneStore((state) => state.loadScenes);

  // Load scenes on mount if not already loaded
  useEffect(() => {
    if (scenes.length === 0 && !loading) {
      loadScenes();
    }
  }, []); // Only run once on mount

  return {
    scenes,
    loading,
    error,
    refetch: loadScenes,
  };
};
