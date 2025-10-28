import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useProjectStoresReset } from '@/app/projects/hooks/useProjectStoresReset';
import { useSceneStore } from '@/app/scenes';

export function EditorLayout() {
  const navigate = useNavigate();

  const { projectId } = useParams<{ channelId: string; projectId: string }>();
  const setCurrentProjectId = useSceneStore((state) => state.setCurrentProjectId);
  const resetAllStores = useProjectStoresReset();
  const previousProjectId = useRef<string | undefined>(undefined);

  // Update project ID when it changes
  useEffect(() => {
    if (projectId && projectId !== previousProjectId.current) {
      // Reset tous les stores avant de charger le nouveau projet
      if (previousProjectId.current) {
        resetAllStores();
      }
      setCurrentProjectId(projectId);
    }
    previousProjectId.current = projectId;
  }, [projectId, setCurrentProjectId, resetAllStores]);

  // Cleanup on unmount (navigating away from editor)
  useEffect(() => {
    return () => {
      resetAllStores();
    };
  }, [resetAllStores]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barre supérieure avec bouton retour intégré */}
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
