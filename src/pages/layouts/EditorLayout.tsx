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
      <header className="w-full flex items-center px-6 py-3 bg-white shadow-sm border-b border-gray-100 z-20">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => navigate(-1)}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 16L7.5 10L12.5 4" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="hidden sm:inline">Retour</span>
        </button>
        {/* Espace pour titre ou actions supplémentaires */}
        <div className="flex-1 text-center font-semibold text-lg text-gray-800">Éditeur de projet</div>
      </header>
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
