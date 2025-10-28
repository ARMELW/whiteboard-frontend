import { Outlet, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSceneStore } from '@/app/scenes';
import { useProjectStore } from '@/app/projects/store';

export function EditorLayout() {
  const { projectId } = useParams<{ channelId: string; projectId: string }>();
  const setCurrentProjectId = useSceneStore((state) => state.setCurrentProjectId);
  const resetSceneStore = useSceneStore((state) => state.reset);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);

  useEffect(() => {
    if (projectId) {
      setCurrentProjectId(projectId);
    }

    // Cleanup function: reset stores when leaving the editor or switching projects
    return () => {
      resetSceneStore();
      setCurrentProject(null);
    };
  }, [projectId, setCurrentProjectId, resetSceneStore, setCurrentProject]);


  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
