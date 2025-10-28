import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useSceneStore } from '@/app/scenes';
import { useProjectStore } from '@/app/projects/store';

export function EditorLayout() {
  const { projectId } = useParams<{ channelId: string; projectId: string }>();
  const setCurrentProjectId = useSceneStore((state) => state.setCurrentProjectId);
  const resetSceneStore = useSceneStore((state) => state.reset);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const previousProjectId = useRef<string | undefined>();

  // Update project ID when it changes
  useEffect(() => {
    if (projectId && projectId !== previousProjectId.current) {
      // Reset stores before loading new project to avoid showing stale data
      if (previousProjectId.current) {
        resetSceneStore();
        setCurrentProject(null);
      }
      setCurrentProjectId(projectId);
    }
    // Update ref after effect runs
    previousProjectId.current = projectId;
  }, [projectId, setCurrentProjectId, resetSceneStore, setCurrentProject]);

  // Cleanup on unmount (navigating away from editor)
  useEffect(() => {
    return () => {
      resetSceneStore();
      setCurrentProject(null);
    };
  }, [resetSceneStore, setCurrentProject]);

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
