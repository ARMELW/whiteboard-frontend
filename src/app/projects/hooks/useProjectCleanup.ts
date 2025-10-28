import { useEffect } from 'react';
import { useSceneStore } from '@/app/scenes';
import { useProjectStore } from '@/app/projects/store';

/**
 * Custom hook to handle cleanup of project and scene stores
 * Use this when navigating away from a project or switching views
 */
export const useProjectCleanup = (shouldCleanup: boolean) => {
  const resetSceneStore = useSceneStore((state) => state.reset);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);

  useEffect(() => {
    if (shouldCleanup) {
      resetSceneStore();
      setCurrentProject(null);
    }
  }, [shouldCleanup, resetSceneStore, setCurrentProject]);
};
